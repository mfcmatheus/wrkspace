import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import moment from 'moment'

import Folder from 'renderer/@types/Folder'
import Workspace from 'renderer/@types/Workspace'
import { fakeId } from '../util'

const store = new Store()

export const onFoldersGet = async (event: IpcMainEvent) => {
  event.reply('folders.get', (store.get('folders') ?? []) as Folder[])
  event.returnValue = (store.get('folders') ?? []) as Folder[]
}

export const onFoldersCreate = async (event: IpcMainEvent, folder: Folder) => {
  const folders = (store.get('folders') ?? []) as Folder[]

  folders.push({ ...folder, id: folder.id ?? fakeId() } as Folder)

  store.set('folders', folders)
  event.reply('folders.reload', folders)

  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  if (!folder.created)
    event.reply('cloud.reload', { w: workspaces, f: folders })

  event.returnValue = folders
}

export const onFoldersDelete = async (event: IpcMainEvent, folder: Folder) => {
  let folders = (store.get('folders') ?? []) as Folder[]
  const index = folders.findIndex((target) => target.id === folder.id)
  const regex = /^[0-9]+$/

  // Check if folder is synced on cloud
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

  event.returnValue = folders
}

export const onFoldersSet = async (event: IpcMainEvent, folders: Folder[]) => {
  store.set('folders', folders)
  event.reply('folders.reload', folders)
  const workspaces = (store.get('workspaces') ?? []) as Workspace[]
  event.reply('cloud.reload', { w: workspaces, f: folders })
}

export const onFoldersUpdate = async (event: IpcMainEvent, folder: Folder) => {
  const folders = (store.get('folders') ?? []) as Folder[]
  const index = folders.findIndex((target) => target.id === folder.id)

  folders[index] = folder
  store.set('folders', folders)

  event.reply('folders.update', folders)
  event.reply('folders.reload', folders)

  event.returnValue = folders
}
