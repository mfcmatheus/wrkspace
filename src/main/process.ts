import { IpcMainEvent, BrowserWindow, dialog } from 'electron'
import Store from 'electron-store'
import moment from 'moment'

import Workspace from 'renderer/@types/Workspace'
import { fakeId, runScript } from './util'

const store = new Store()

const openEditor = (
  event: IpcMainEvent,
  mainWindow: BrowserWindow,
  workspace: Workspace
) => {
  event.reply('workspaces.open.status', 'Opening with editor ...')

  const process = runScript(
    mainWindow as BrowserWindow,
    `open -a 'Visual Studio Code' '${workspace.path}'`,
    [''],
    () => ({})
  )

  process.stdout.on('data', (data) => {
    event.reply('workspaces.open.status', data.toString())
  })

  event.reply('workspaces.open.status', 'Success')
}

const executeTerminalCommands = (
  event: IpcMainEvent,
  mainWindow: BrowserWindow,
  workspace: Workspace
) => {
  event.reply('workspaces.open.status', 'Executing terminal commands ...')

  workspace.terminals?.forEach((terminal) => {
    const escapedPath = workspace.path.replace("'", "'\\''")
    const escapedCommand = terminal.command.replace(/(["\\$`])/g, '\\$1')

    const osascriptCommand = `osascript -e 'tell app "Terminal" to do script "cd '\\''${escapedPath}'\\'' && ${escapedCommand}"'`

    runScript(mainWindow as BrowserWindow, osascriptCommand, [''], () => ({}))
  })

  event.reply('workspaces.open.status', 'Success')
}

const startDockerCompose = (
  event: IpcMainEvent,
  mainWindow: BrowserWindow,
  workspace: Workspace
) => {
  if (!workspace.enableDocker || !workspace.enableDockerCompose) {
    return
  }

  event.reply('workspaces.open.status', 'Starting docker compose ...')

  const process = runScript(
    mainWindow as BrowserWindow,
    `cd '${workspace.path}' && /usr/local/bin/docker compose up -d`,
    [''],
    () => ({})
  )

  process.stdout.on('data', (data) => {
    event.reply('workspaces.open.status', data.toString())
  })

  event.reply('workspaces.open.status', 'Success')
}

const startDockerContainers = (
  event: IpcMainEvent,
  mainWindow: BrowserWindow,
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

  workspace.containers.forEach((container) => {
    const process = runScript(
      mainWindow as BrowserWindow,
      `/usr/local/bin/docker start ${container}`,
      [''],
      () => ({})
    )

    process.stdout.on('data', (data) => {
      event.reply('workspaces.open.status', data.toString())
    })
  })

  event.reply('workspaces.open.status', 'Success')
}

export const onWorkspaceOpen = (
  mainWindow: BrowserWindow,
  event: IpcMainEvent,
  workspace: Workspace
) => {
  const workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex(
    (target: Workspace) => target.id === workspace.id
  )

  workspaces[index].opened_at = moment().format('YYYY-MM-DD HH:mm:ss')

  store.set('workspaces', workspaces)

  // Open VSCode
  openEditor(event, mainWindow as BrowserWindow, workspace)
  // Execute terminal commands
  executeTerminalCommands(event, mainWindow as BrowserWindow, workspace)
  // Start docker compose containers
  startDockerCompose(event, mainWindow as BrowserWindow, workspace)
  // Start docker containers
  startDockerContainers(event, mainWindow as BrowserWindow, workspace)
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

export const onContainersGet = async (
  mainWindow: BrowserWindow,
  event: IpcMainEvent
) => {
  const process = runScript(
    mainWindow as BrowserWindow,
    `/usr/local/bin/docker container ls -a --format '{{json .}}'`,
    [''],
    () => ({})
  )

  process.stdout.on('data', (data) => {
    event.reply('containers.get', data.toString())
  })
}

export default {
  onWorkspaceOpen,
  onWorkspaceGet,
  onWorkspaceUpdate,
  onWorkspaceDelete,
  onWorkspaceCreate,
  onOpenDirectory,
  onContainersGet,
}
