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
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import Store from 'electron-store'
import moment from 'moment'
import Workspace from 'renderer/@types/Workspace'
import MenuBuilder from './menu'
import { fakeId, resolveHtmlPath, runScript } from './util'

const store = new Store()

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null = null

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`
  console.log(msgTemplate(arg))
  event.reply('ipc-example', msgTemplate('pong'))
})

ipcMain.on('workspaces.open', async (event, workspace: Workspace) => {
  const workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex(
    (target: Workspace) => target.id === workspace.id
  )

  workspaces[index].opened_at = moment().format('YYYY-MM-DD HH:mm:ss')

  store.set('workspaces', workspaces)

  // Open VSCode
  runScript(
    mainWindow as BrowserWindow,
    `open -a 'Visual Studio Code' ${workspace.path}`,
    [''],
    () => ({})
  )

  // Execute terminal commands
  workspace.terminals?.forEach((terminal) => {
    runScript(
      mainWindow as BrowserWindow,
      `osascript -e 'tell app "Terminal" \n
        do script "cd '${workspace.path}' && ${terminal.command}" \n
      end tell'`,
      [''],
      () => ({})
    )
  })
})

ipcMain.on('workspaces.get', async (event) => {
  event.reply('workspaces.get', (store.get('workspaces') ?? []) as Workspace[])
})

ipcMain.on('workspaces.update', async (event, workspace: Workspace) => {
  const workspaces = store.get('workspaces') as Workspace[]
  const index = workspaces.findIndex(
    (target: Workspace) => target.id === workspace.id
  )

  workspaces[index] = workspace
  store.set('workspaces', workspaces)

  event.reply('workspaces.update', workspaces)
})

ipcMain.on('workspaces.delete', async (event, workspace: Workspace) => {
  let workspaces = store.get('workspaces') as Workspace[]
  workspaces = workspaces.filter((target) => target.id !== workspace.id)

  store.set('workspaces', workspaces)

  event.reply('workspaces.delete', workspaces)
})

ipcMain.on('workspaces.create', async (event, workspace: Workspace) => {
  workspace.id = fakeId()
  workspace.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

  let workspaces = (store.get('workspaces') ?? []) as Workspace[]
  workspaces = [...workspaces, workspace]

  store.set('workspaces', workspaces)

  event.reply('workspaces.create', workspaces)
})

ipcMain.on('dialog:openDirectory', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    mainWindow as BrowserWindow,
    {
      properties: ['openDirectory'],
    }
  )

  if (!canceled && filePaths.length) {
    event.reply('dialog:openDirectory', filePaths[0])
  }
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDebug) {
  require('electron-debug')()
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
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
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

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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
