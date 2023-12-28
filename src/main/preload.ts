// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export type Channels =
  | 'workspaces.get'
  | 'workspaces.update'
  | 'workspaces.delete'
  | 'workspaces.create'
  | 'workspaces.open'
  | 'workspaces.uninstall'
  | 'workspaces.install'
  | 'workspaces.reload'
  | 'dialog:openDirectory'
  | 'containers.get'
  | 'services.docker'
  | 'folders.get'
  | 'folders.create'
  | 'folders.delete'
  | 'folders.set'
  | 'folders.reload'
  | 'settings.get'
  | 'settings.update'
  | 'settings.reload'
  | 'applications.get'
  | 'process'
  | 'user.get'
  | 'user.set'
  | 'user.authenticate'
  | 'user.logout'

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args)
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args)
      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    removeListener(channel: Channels) {
      ipcRenderer.removeAllListeners(channel)
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    },
  },
}

contextBridge.exposeInMainWorld('electron', electronHandler)

export type ElectronHandler = typeof electronHandler
