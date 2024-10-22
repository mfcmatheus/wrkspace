import { childProcess, execSync } from 'child_process'
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path'
import nodePath from 'node:path'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import Store from 'electron-store'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import MenuBuilder from './menu'
import { killProcesses, resolveHtmlPath } from './util'
import registerIpcHandlers from './ipcHandlers'

const store = new Store()
require('bplist-creator')

class AppUpdater {
  constructor(mainWindow: BrowserWindow) {
    autoUpdater.setFeedURL({
      url: `https://updater.wrkspace.co/update/${
        process.platform
      }/${app.getVersion()}`,
      provider: 'generic',
    })

    autoUpdater.on('update-available', () => {
      autoUpdater.downloadUpdate()
    })

    autoUpdater.on('update-downloaded', (info) => {
      mainWindow.webContents.send('update.downloaded', info)
    })

    autoUpdater.checkForUpdates()

    ipcMain.on('update.install', () => autoUpdater.quitAndInstall())
  }
}

export let mainWindow: BrowserWindow | null = null

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`
  console.log(msgTemplate(arg))
  event.reply('ipc-example', msgTemplate('pong'))
})

ipcMain.on('dialog:openDirectory', async (event, reference: string | number) =>
  onOpenDirectory(mainWindow as BrowserWindow, event, reference)
)

registerIpcHandlers()

process.env.APP_URL = 'http://localhost:3000'

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()

  process.env.APP_URL = 'https://wrkspace.co'
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDebug) {
  require('electron-debug')()

  loadDevMessages()
  loadErrorMessages()
}

// store.delete('workspaces')
// store.delete('settings')
// store.delete('folders')
// store.delete('token')

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('wrkspace', process.execPath, [
      nodePath.resolve(process.argv[1]),
    ])
  }
} else {
  app.setAsDefaultProtocolClient('wrkspace')
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    frame: false,
    transparent: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 11, y: 10 },
    show: false,
    width: 1168,
    height: 720,
    minWidth: 1168,
    minHeight: 720,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  })

  mainWindow.loadURL(resolveHtmlPath('index.html'))

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
    }

    mainWindow.webContents.send('token.reload', store.get('token'))
    // store.delete('processes')

    killProcesses()

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater(mainWindow)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url)
    return { action: 'deny' }
  })
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('open-url', (event, url) => {
  const mappedUrl = new URL(url)

  const action = url.match(/wrkspace:\/\/(.*?)\?/)?.[1]
  const params = new URLSearchParams(mappedUrl.search)

  if (action === 'authorize') {
    const token = params.get('token')
    store.set('token', token)
    mainWindow?.webContents.send('token.reload', token)
  }

  // dialog.showErrorBox('Welcome Back', mappedUrl.search ?? '')
})

app
  .whenReady()
  .then(() => {
    createWindow()
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow()
    })
  })
  .catch(console.log)
