import fs from 'fs'
import { spawn } from 'child_process'
import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import Workspace from 'renderer/@types/Workspace'
import Terminal from 'renderer/@types/Terminal'
import Container from 'renderer/@types/Container'
import Browser from 'renderer/@types/Browser'
import EnvVar from 'renderer/@types/EnvVar'
import Command from 'renderer/@types/Command'
import Setting from 'renderer/@types/Setting'
import {
  onWorkspaceUpdate,
  onWorkspaceCreate,
} from '../handlers/workspaceHandlers'
import { runScript, resolveString, terminal } from '../util'

// Import the handlers that might be needed within utils

const store = new Store()

export const openEditor = (
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

export const openBrowser = (browser: Browser): Promise<void> =>
  new Promise((resolve, reject) => {
    const process = runScript(`open -g '${browser.url}'`, [''], () => ({}))

    process.on('close', resolve)
    process.on('error', reject)
  })

export const openBrowsers = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  if (!workspace.browsers?.length) return

  for (const browser of workspace.browsers ?? []) {
    await openBrowser(browser)
  }
}

export const executeTerminalCommand = (
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

export const executeTerminalCommands = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  if (!workspace.terminals?.length) return

  for (const terminalCommand of workspace.terminals ?? []) {
    await executeTerminalCommand(workspace, terminalCommand)
  }
}

export const startDockerCompose = (
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

export const startDockerContainer = (
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

export const startDockerContainers = async (
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

  for (const container of workspace.docker?.containers ?? []) {
    await startDockerContainer(event, container, workspace)
  }
}

export const workspaceExists = (workspace: Workspace): boolean => {
  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  return !!workspaces.find((target: Workspace) => target.id === workspace.id)
}

export const cloneProject = async (
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

export const createEnvFile = async (
  event: IpcMainEvent,
  workspace: Workspace
): Promise<any> =>
  new Promise((resolve) => {
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

    for (const command of workspace.installation?.commands ?? []) {
      await runCommand(event, workspace, command).catch(reject)
    }

    event.reply('workspaces.open.status', { workspace, message: 'Success' })

    resolve(true)
  })
