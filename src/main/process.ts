import fs from 'fs'
import { spawn } from 'child_process'
import { IpcMainEvent, BrowserWindow, dialog } from 'electron'
import Store from 'electron-store'
import moment from 'moment'
import isRunning from 'is-running'

import treeKill from 'tree-kill'
import Workspace from 'renderer/@types/Workspace'
import Terminal from 'renderer/@types/Terminal'
import Container from 'renderer/@types/Container'
import Folder from 'renderer/@types/Folder'
import Setting from 'renderer/@types/Setting'
import Browser from 'renderer/@types/Browser'
import User from 'renderer/@types/User'
import EnvVar from 'renderer/@types/EnvVar'
import Command from 'renderer/@types/Command'
import Process from 'renderer/@types/Process'
import {
  fakeId,
  runScript,
  resolveString,
  terminal,
  killProcesses,
  runningProcesses,
} from './util'
import { mainWindow } from './main'

const store = new Store()

const openEditor = (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    if (!workspace.features?.enableEditor || !workspace.editor) {
      reject(new Error('Editor is not enabled'))

      return
    }

    const process = runScript(
      `open -g -a '${workspace.editor}' '${workspace.path}'`,
      [''],
      () => ({})
    )

    process.on('close', resolve)
    process.on('error', reject)
  })

const openBrowser = (browser: Browser): Promise<void> =>
  new Promise((resolve, reject) => {
    const process = runScript(
      // `open -g -a '/Applications/${browser.application}.app' '${browser.url}'`,
      `open -g '${browser.url}'`,
      [''],
      () => ({})
    )

    process.on('close', resolve)
    process.on('error', reject)
  })

const openBrowsers = async (event: IpcMainEvent, workspace: Workspace) => {
  if (!workspace.browsers?.length) return

  // eslint-disable-next-line no-restricted-syntax
  for (const browser of workspace.browsers ?? []) {
    // eslint-disable-next-line no-await-in-loop
    await openBrowser(browser)
  }
}

const executeTerminalCommand = (
  workspace: Workspace,
  workspaceTerminal: Terminal
): Promise<boolean> =>
  new Promise((resolve) => {
    terminal(
      workspaceTerminal.command,
      workspace,
      workspace.path,
      workspaceTerminal.command
    )

    resolve(true)
  })

const executeTerminalCommands = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  if (!workspace.terminals?.length) return

  // eslint-disable-next-line no-restricted-syntax
  for (const terminal of workspace.terminals ?? []) {
    // eslint-disable-next-line no-await-in-loop
    await executeTerminalCommand(workspace, terminal)
  }
}

const startDockerCompose = (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    if (
      !workspace.features?.enableDocker ||
      !workspace.docker?.enableComposer
    ) {
      reject(new Error('Docker is not enabled'))

      return
    }

    const command = workspace.docker?.enableSail
      ? `WWWGROUP=1000 WWWUSER=1000 /usr/local/bin/docker compose up`
      : `/usr/local/bin/docker compose up`

    terminal(command, workspace, workspace.path, 'Docker compose')

    resolve(true)
  })

const startDockerContainer = (
  event: IpcMainEvent,
  container: Container,
  workspace: Workspace
): Promise<boolean> =>
  new Promise((resolve) => {
    terminal(
      `docker start ${container}`,
      workspace,
      undefined,
      `Start container ${container}`
    )

    resolve(true)
  })

const startDockerContainers = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  if (
    !workspace.features?.enableDocker ||
    !workspace.docker?.enableContainers ||
    !workspace.docker?.containers?.length
  ) {
    return
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const container of workspace.docker?.containers ?? []) {
    // eslint-disable-next-line no-await-in-loop
    await startDockerContainer(event, container, workspace)
  }
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

  const filteredProcesses = killProcesses(workspace)

  store.set('workspaces', workspaces)
  store.set('processes', filteredProcesses)

  event.reply('workspaces.reload', workspaces)
  event.reply('processes.update', filteredProcesses)

  // Open with editor
  await openEditor(event, workspace).catch(() => {})
  // Open browsers
  await openBrowsers(event, workspace).catch(() => {})
  // Execute terminal commands
  await executeTerminalCommands(event, workspace).catch(() => {})
  // Start docker compose containers
  await startDockerCompose(event, workspace).catch(() => {})
  // Start docker containers
  await startDockerContainers(event, workspace).catch(() => {})

  workspaces[index].loading = false

  store.set('workspaces', workspaces)
  event.reply('workspaces.reload', workspaces)
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
  event.reply('workspaces.reload', workspaces)

  const folders = (store.get('folders') ?? []) as Folder[]
  if (!workspace.updated)
    event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onWorkspaceDelete = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  let workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex((target) => target.id === workspace.id)
  const regex = /^[0-9]+$/

  // Check if workspace is synced on cloud
  if (regex.test(workspace.id.toString()) && !workspace.deleted) {
    workspace.deleted_at = moment().format('YYYY-MM-DD HH:mm:ss')
    workspaces[index] = workspace
  } else {
    workspaces = workspaces.filter((target) => target.id !== workspace.id)
  }

  store.set('workspaces', workspaces)

  event.reply('workspaces.delete', workspaces)
  event.reply('workspaces.reload', workspaces)

  const folders = (store.get('folders') ?? []) as Folder[]
  if (!workspace.deleted)
    event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onWorkspaceCreate = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  workspace.id = workspace.id ?? fakeId()
  workspace.created_at =
    workspace.created_at ?? moment().format('YYYY-MM-DD HH:mm:ss')

  let workspaces = (store.get('workspaces') ?? []) as Workspace[]
  workspaces = [...workspaces, workspace]

  store.set('workspaces', workspaces)

  event.reply('workspaces.create', workspaces)
  event.reply('workspaces.reload', workspaces)

  const folders = (store.get('folders') ?? []) as Folder[]
  if (!workspace.created)
    event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onWorkspaceUninstall = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  if (!workspace.repo || !workspace.path) return

  fs.rmSync(workspace.path, { recursive: true, force: true })

  let workspaces = (store.get('workspaces') ?? []) as Workspace[]
  workspaces = workspaces.filter((target) => target.id !== workspace.id)
  store.set('workspaces', workspaces)

  event.reply('workspaces.uninstall', workspaces)
  event.reply('workspaces.reload', workspaces)

  const folders = (store.get('folders') ?? []) as Folder[]
  event.reply('cloud.reload', { w: workspaces, f: folders })
}

const workspaceExists = (workspace: Workspace): boolean => {
  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  return !!workspaces.find((target: Workspace) => target.id === workspace.id)
}

const cloneProject = async (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<any> =>
  new Promise((resolve, reject) => {
    const settings = (store.get('settings') ?? {}) as Setting
    const gitPath = runScript(`which git`, [''], () => ({}))

    gitPath.stdout.on('data', (path) => {
      event.reply('workspaces.open.status', {
        workspace,
        message: `Git located at ${path.toString()}`,
      })

      const clonePath = workspace.folder?.path ?? settings.defaultPath

      const gitClone = runScript(
        `cd ${clonePath} && ${path.toString().trim()} clone --depth=1 ${
          workspace.repo
        } ${resolveString(workspace.name.toLowerCase())}`,
        [''],
        () => ({})
      )

      gitClone.stdout.on('data', (data) => {
        event.reply('workspaces.open.status', {
          workspace,
          message: data.toString(),
        })
      })

      gitClone.stderr.on('data', (data) => {
        event.reply('workspaces.open.status', {
          workspace,
          message: data.toString(),
        })
      })

      gitClone.on('error', (data) => {
        event.reply('workspaces.open.status', {
          workspace,
          message: data.toString(),
        })

        reject(data)
      })

      gitClone.on('close', async () => {
        event.reply('workspaces.open.status', {
          workspace,
          message: 'Cloned successfully',
        })

        workspace.path = `${clonePath}/${resolveString(
          workspace.name.toLowerCase()
        )}`

        workspaceExists(workspace)
          ? await onWorkspaceUpdate(event, { ...workspace, updated: true })
          : await onWorkspaceCreate(event, { ...workspace, created: true })

        resolve(true)
      })
    })
  })

const createEnvFile = async (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!workspace.installation?.variables?.length) return

    const envFile = `${workspace.path}/.env`
    const envExample = `${workspace.path}/.env.example`

    if (fs.existsSync(envFile)) return

    if (fs.existsSync(envExample)) {
      const data = fs
        .readFileSync(envExample, 'utf8')
        .split('\n')
        .reduce((accumulator: string, line: string) => {
          const variable = workspace.installation?.variables?.find(
            (target: EnvVar) => target.key === line.split('=')[0]
          )

          if (variable) {
            accumulator += `${variable.key}=${variable.value}\n`
          } else {
            accumulator += `${line}\n`
          }

          return accumulator
        })

      fs.writeFileSync(envFile, data)

      event.reply('workspaces.open.status', {
        workspace,
        message: `Updated ${envFile}`,
      })
    } else {
      const data = workspace.installation?.variables.reduce(
        (accumulator: string, variable: EnvVar) => {
          accumulator += `${variable.key}=${variable.value}\n`
          return accumulator
        },
        ''
      )

      fs.writeFileSync(envFile, data)

      event.reply('workspaces.open.status', {
        workspace,
        message: `Created ${envFile}`,
      })
    }

    resolve(true)
  })

export const runCommand = async (
  event: IpcMainEvent,
  workspace: Workspace,
  command: Command
): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!workspace.path) return

    event.reply('workspaces.open.status', {
      workspace,
      message: `Running command ${command.command} ...`,
    })

    const escapedPath = workspace.path.replace("'", "'\\''")
    const escapedCommand = command.command.replace(/(["\\$`])/g, '\\$1')

    // TODO: Find a way to output logs directly on application
    const osascriptCommand = `
      osascript -e 'tell app "Terminal" to do script "cd ${escapedPath} && ${escapedCommand}"' \
      -e 'tell application "Terminal" to set myWin to window 1' \
      -e 'tell application "Terminal" to repeat' \
      -e 'delay 1' \
      -e 'if not busy of myWin then exit repeat' \
      -e 'end repeat' \
      -e 'close myWin'`

    const process = spawn(osascriptCommand, [], {
      shell: true,
    })

    process.on('close', () => {
      event.reply('workspaces.open.status', { workspace, message: 'Finished' })
      resolve(true)
    })

    process.on('error', reject)
  })

export const runCommands = async (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<any> =>
  new Promise(async (resolve, reject) => {
    if (!workspace.installation?.commands?.length) return

    event.reply('workspaces.open.status', {
      workspace,
      message: 'Running commands ...',
    })

    // eslint-disable-next-line no-restricted-syntax
    for (const command of workspace.installation?.commands ?? []) {
      // eslint-disable-next-line no-await-in-loop
      await runCommand(event, workspace, command).catch(reject)
    }

    event.reply('workspaces.open.status', { workspace, message: 'Success' })

    resolve(true)
  })

export const onWorkspaceInstall = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  event.reply('workspaces.open.status', { workspace, message: false })

  await cloneProject(event, workspace)
  await createEnvFile(event, workspace)
  await runCommands(event, workspace)

  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  const folders = (store.get('folders') ?? []) as Folder[]
  event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onOpenDirectory = async (
  mainWindow: BrowserWindow,
  event: IpcMainEvent,
  reference: string | number
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    mainWindow as BrowserWindow,
    {
      properties: ['openDirectory'],
    }
  )

  if (!canceled && filePaths.length) {
    event.reply('dialog:openDirectory', filePaths[0], reference)
  }
}

export const onContainersGet = async (event: IpcMainEvent) => {
  const process = runScript(
    `/usr/local/bin/docker container ls -a --format '{"ID":"{{.ID}}","Names":"{{.Names}}"}'`,
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

export const onServicesGit = async (event: IpcMainEvent) => {
  const gitPath = runScript(`which git`, [''], () => ({}))
  gitPath.stdout.on('data', (path) => {
    event.reply('services.git', !!path.toString().trim())
  })
}

export const onFoldersGet = async (event: IpcMainEvent) => {
  event.reply('folders.get', (store.get('folders') ?? []) as Folder[])
}

export const onFoldersCreate = async (event: IpcMainEvent, folder: Folder) => {
  const folders = (store.get('folders') ?? []) as Folder[]

  folders.push({ ...folder, id: folder.id ?? fakeId() } as Folder)

  store.set('folders', folders)
  event.reply('folders.reload', folders)

  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  if (!folder.created)
    event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onFoldersDelete = async (event: IpcMainEvent, folder: Folder) => {
  let folders = (store.get('folders') ?? []) as Folder[]
  const index = folders.findIndex((target) => target.id === folder.id)
  const regex = /^[0-9]+$/

  // Check if workspace is synced on cloud
  if (regex.test(folder.id.toString()) && !folder.deleted) {
    folder.deleted_at = moment().format('YYYY-MM-DD HH:mm:ss')
    folders[index] = folder
  } else {
    folders = folders.filter((target) => target.id !== folder.id)
  }

  store.set('folders', folders)
  event.reply('folders.reload', folders)

  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  if (!folder.deleted)
    event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onFoldersSet = async (event: IpcMainEvent, folders: Folder[]) => {
  store.set('folders', folders)
  event.reply('folders.reload', folders)
  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  event.reply('cloud.reload', { w: workspaces, f: folders })
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
  event.reply('settings.reload', { ...setting, ...settings })
}

export const onApplicationsGet = async (event: IpcMainEvent) => {
  let applications = fs.readdirSync('/Applications') ?? []
  applications = applications.filter((application) =>
    application.endsWith('.app')
  )
  event.reply('applications.get', applications)
}

export const onProcess = (event: IpcMainEvent) => {
  const { NODE_ENV } = process.env
  event.reply('process', { NODE_ENV })
}

export const onProcessOpen = (event: IpcMainEvent, workspace: Workspace) => {
  terminal('', workspace, workspace.path, 'Terminal', false)
}

export const onTerminalData = (
  event: IpcMainEvent,
  data: { pid: string | number; data: string }
) => {
  const ptyProcess = runningProcesses.find(
    (target: Process) => target.pid === data.pid
  )

  ptyProcess?.write(data.data)
}

export const onProcessClose = (event: IpcMainEvent, process: Process) => {
  try {
    treeKill(process?.pid as number)

    const ptyProcess = runningProcesses.find(
      (target: Process) => target.pid === process.pid
    )
    ptyProcess?.write('exit\n')

    const interval = setInterval(() => {
      if (isRunning(process?.pid as number)) return

      setTimeout(() => {
        const processes = (store.get('processes') ?? []) as Process[]
        const filteredProcesses = processes.filter(
          (target: Process) => target?.pid !== process?.pid
        )

        store.set('processes', filteredProcesses)
        event.reply('processes.update', filteredProcesses)
      }, 250)

      clearInterval(interval)
    }, 250)
  } catch {
    //
  }
}

export const onUserGet = (event: IpcMainEvent) => {
  const user = store.get('user') ?? null
  event.reply('user.get', user)
}

export const onUserSet = (event: IpcMainEvent, user: User) => {
  if (!user) return
  store.set('user', user)
}

export const onUserAuthenticate = async (event: IpcMainEvent) => {
  runScript(`open '${process.env.APP_URL}/authorize'`, [''], () => ({}))
}

export const onUserUpgrade = async (event: IpcMainEvent) => {
  runScript(`open '${process.env.APP_URL}/signup'`, [''], () => ({}))
}

export const onUserLogout = async (event: IpcMainEvent) => {
  store.delete('user')
  store.delete('token')
  event.reply('user.logout')
}

export default {
  onWorkspaceOpen,
  onWorkspaceGet,
  onWorkspaceUpdate,
  onWorkspaceDelete,
  onWorkspaceCreate,
  onWorkspaceUninstall,
  onWorkspaceInstall,
  onOpenDirectory,
  onContainersGet,
  onServicesDocker,
  onServicesGit,
  onFoldersGet,
  onFoldersCreate,
  onFoldersDelete,
  onFoldersSet,
  onSettingsGet,
  onSettingsUpdate,
  onApplicationsGet,
  onProcess,
  onProcessClose,
  onUserGet,
  onUserSet,
  onUserAuthenticate,
  onUserUpgrade,
  onUserLogout,
  onTerminalData,
}
