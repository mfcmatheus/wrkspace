import fs from 'fs'
import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import moment from 'moment'

import Workspace from 'renderer/@types/Workspace'

import { fakeId, killProcesses } from '../util'
import {
  openEditor,
  openBrowsers,
  executeTerminalCommands,
  startDockerCompose,
  startDockerContainers,
  cloneProject,
  createEnvFile,
  runCommands,
} from '../utils/workspaceUtils'

const store = new Store()

export const onWorkspaceOpen = async (
  event: IpcMainEvent,
  workspace: Workspace
) => {
  const workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex(
    (target: Workspace) => target.id === workspace.id
  )

  workspaces[index].opened_at = moment().format('YYYY-MM-DD HH:mm:ss')
  workspaces[index].times_opened = (workspaces[index].times_opened ?? 0) + 1
  workspaces[index].activities = [
    ...(workspaces[index].activities ?? []),
    {
      type: 'open',
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  ]
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
  event.returnValue = workspaces
}

export const onWorkspaceGet = async (event: IpcMainEvent) => {
  event.reply('workspaces.get', (store.get('workspaces') ?? []) as Workspace[])
  event.returnValue = (store.get('workspaces') ?? []) as Workspace[]
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

  event.returnValue = workspaces
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

  event.returnValue = workspaces
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

  event.returnValue = workspaces
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
