import { IpcMainEvent, BrowserWindow, dialog } from 'electron'
import Store from 'electron-store'
import moment from 'moment'

import Workspace from 'renderer/@types/Workspace'
import Terminal from 'renderer/@types/Terminal'
import Container from 'renderer/@types/Container'
import Folder from 'renderer/@types/Folder'
import Setting from 'renderer/@types/Setting'
import { fakeId, runScript } from './util'

const store = new Store()

const openEditor = (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    event.reply('workspaces.open.status', 'Opening with editor ...')

    const process = runScript(
      `open -a 'Visual Studio Code' '${workspace.path}'`,
      [''],
      () => ({})
    )

    process.stdout.on('data', (data) => {
      event.reply('workspaces.open.status', data.toString())
    })

    process.on('close', () => {
      event.reply('workspaces.open.status', 'Success')
      resolve(true)
    })
    process.on('error', reject)
  })

const executeTerminalCommand = (
  workspace: Workspace,
  terminal: Terminal
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const escapedPath = workspace.path.replace("'", "'\\''")
    const escapedCommand = terminal.command.replace(/(["\\$`])/g, '\\$1')

    const osascriptCommand = `osascript -e 'tell app "Terminal" to do script "cd '\\''${escapedPath}'\\'' && ${escapedCommand}"'`

    const process = runScript(osascriptCommand, [''], () => ({}))

    process.on('close', () => resolve(true))
    process.on('error', reject)
  })

const executeTerminalCommands = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  event.reply('workspaces.open.status', 'Executing terminal commands ...')

  // eslint-disable-next-line no-restricted-syntax
  for (const terminal of workspace.terminals ?? []) {
    // eslint-disable-next-line no-await-in-loop
    await executeTerminalCommand(workspace, terminal)
  }

  event.reply('workspaces.open.status', 'Success')
}

const startDockerCompose = (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    if (!workspace.enableDocker || !workspace.enableDockerCompose) {
      reject(new Error('Docker is not enabled'))

      return
    }

    event.reply('workspaces.open.status', 'Starting docker compose ...')

    const process = runScript(
      `cd '${workspace.path}' && /usr/local/bin/docker compose up -d`,
      [''],
      () => ({})
    )

    process.stdout.on('data', (data) => {
      event.reply('workspaces.open.status', data.toString())
    })

    process.on('close', () => {
      event.reply('workspaces.open.status', 'Success')
      resolve(true)
    })
    process.on('error', reject)
  })

const startDockerContainer = (
  event: IpcMainEvent,
  container: Container
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const process = runScript(
      `/usr/local/bin/docker start ${container}`,
      [''],
      () => ({})
    )

    process.stdout.on('data', (data) => {
      event.reply('workspaces.open.status', data.toString())
    })

    process.on('close', () => resolve(true))
    process.on('error', reject)
  })

const startDockerContainers = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  if (
    !workspace.enableDocker ||
    !workspace.enableDockerContainers ||
    !workspace.containers?.length
  ) {
    return
  }

  event.reply('workspaces.open.status', 'Starting docker containers ...')

  // eslint-disable-next-line no-restricted-syntax
  for (const container of workspace.containers ?? []) {
    // eslint-disable-next-line no-await-in-loop
    await startDockerContainer(event, container)
  }

  event.reply('workspaces.open.status', 'Success')
}

export const onWorkspaceOpen = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  const workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex(
    (target: Workspace) => target.id === workspace.id
  )

  workspaces[index].opened_at = moment().format('YYYY-MM-DD HH:mm:ss')
  workspaces[index].loading = true

  store.set('workspaces', workspaces)

  // Open with editor
  await openEditor(event, workspace).catch(() => {})
  // Execute terminal commands
  await executeTerminalCommands(event, workspace).catch(() => {})
  // Start docker compose containers
  await startDockerCompose(event, workspace).catch(() => {})
  // Start docker containers
  await startDockerContainers(event, workspace).catch(() => {})

  workspaces[index].loading = false

  store.set('workspaces', workspaces)
}

export const onWorkspaceGet = async (event: IpcMainEvent) => {
  event.reply('workspaces.get', (store.get('workspaces') ?? []) as Workspace[])
}

export const onWorkspaceUpdate = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  const workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex(
    (target: Workspace) => target.id === workspace.id
  )

  workspaces[index] = workspace
  store.set('workspaces', workspaces)

  event.reply('workspaces.update', workspaces)
}

export const onWorkspaceDelete = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  let workspaces = store.get('workspaces') as Workspace[]
  workspaces = workspaces.filter((target) => target.id !== workspace.id)

  store.set('workspaces', workspaces)

  event.reply('workspaces.delete', workspaces)
}

export const onWorkspaceCreate = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  workspace.id = fakeId()
  workspace.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

  let workspaces = (store.get('workspaces') ?? []) as Workspace[]
  workspaces = [...workspaces, workspace]

  store.set('workspaces', workspaces)

  event.reply('workspaces.create', workspaces)
}

export const onOpenDirectory = async (
  mainWindow: BrowserWindow,
  event: IpcMainEvent
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    mainWindow as BrowserWindow,
    {
      properties: ['openDirectory'],
    }
  )

  if (!canceled && filePaths.length) {
    event.reply('dialog:openDirectory', filePaths[0])
  }
}

export const onContainersGet = async (event: IpcMainEvent) => {
  const process = runScript(
    `/usr/local/bin/docker container ls -a --format '{{json .}}'`,
    [''],
    () => ({})
  )

  process.stdout.on('data', (data) => {
    event.reply('containers.get', data.toString())
  })
}

export const onServicesDocker = async (event: IpcMainEvent) => {
  const process = runScript(`/usr/local/bin/docker info`, [''], () => ({}))

  process.stderr.on('data', (data) => {
    event.reply(
      'services.docker',
      !data.toString().includes('Is the docker daemon running?')
    )
  })
}

export const onFoldersGet = async (event: IpcMainEvent) => {
  event.reply('folders.get', (store.get('folders') ?? []) as Folder[])
}

export const onFoldersCreate = async (event: IpcMainEvent, folder: Folder) => {
  const folders = (store.get('folders') ?? []) as Folder[]

  folders.push({ id: fakeId(), ...folder } as Folder)

  store.set('folders', folders)
}

export const onSettingsGet = async (event: IpcMainEvent) => {
  event.reply('settings.get', (store.get('settings') ?? {}) as Setting)
}

export const onSettingsUpdate = async (
  event: IpcMainEvent,
  settings: Setting
) => {
  const setting = (store.get('settings') ?? {}) as Setting
  store.set('settings', { ...setting, ...settings } as Setting)
}

export default {
  onWorkspaceOpen,
  onWorkspaceGet,
  onWorkspaceUpdate,
  onWorkspaceDelete,
  onWorkspaceCreate,
  onOpenDirectory,
  onContainersGet,
  onServicesDocker,
  onFoldersGet,
  onFoldersCreate,
  onSettingsGet,
  onSettingsUpdate,
}
