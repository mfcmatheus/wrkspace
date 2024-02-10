/* eslint import/prefer-default-export: off */
import { URL } from 'url'
import path from 'path'

import childProcess from 'child_process'
import os from 'os'
import { dialog } from 'electron'
import { IEvent } from 'xterm'
import Store from 'electron-store'

import Workspace from 'renderer/@types/Workspace'
import { mainWindow } from './main'

const pty = require('node-pty')

const store = new Store()
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh'

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212
    const url = new URL(`http://localhost:${port}`)
    url.pathname = htmlFileName
    return url.href
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
}

export function fakeId(length: number = 16) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const resolveString = (str: string) => {
  // Remove special characters except dashes and spaces
  let processedString = str.replace(/[^\w\s-]/gi, '')
  // Replace spaces with dashes
  processedString = processedString.replace(/\s+/g, '-')
  // Return the processed string
  return processedString
}

interface ITerminalReturn {
  onOutput: IEvent<string>
  onExit: IEvent<number>
  process: typeof pty.spawn
}

async function storeProcess(
  workspace: Workspace,
  pid: number,
  data: string,
  title: string
) {
  const processes = (await store.get('processes')) ?? []
  let index = processes.findIndex((process) => process.pid === pid)
  index = index === -1 ? processes.length : index

  const process = {
    workspace,
    pid,
    title,
    data: [...(processes?.[index]?.data ?? []), data],
  }

  processes[index] = process

  store.set('processes', processes)
  mainWindow?.webContents.send('processes.update', processes)
}

export function terminal(
  command: string,
  workspace: Workspace,
  basePath: string | undefined = process.env.HOME,
  title: string | undefined = 'Terminal'
): ITerminalReturn {
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: basePath,
    env: process.env,
  })

  const defaultOnOutputCallback = (data: string) => {
    storeProcess(workspace, ptyProcess.pid, data, title)
    mainWindow?.webContents.send('terminal.incData', {
      data,
      workspace,
      title,
      pid: ptyProcess.pid,
    })
  }

  const onOutput = (
    callback: (data: string) => void = defaultOnOutputCallback
  ) => {
    return ptyProcess.on('data', callback)
  }

  const onExit = (callback: (exitCode: number) => void = () => {}) => {
    return ptyProcess.on('exit', callback)
  }

  ptyProcess.write(`${command} \r`)
  ptyProcess.write(`exit \r`)

  /* ipcMain.on('terminal.toTerm', (event, data) => {
    ptyProcess.write(data)
  }) */

  onOutput()
  onExit()

  return {
    onOutput,
    onExit,
    process: ptyProcess,
  }
}

export function runScript(
  command: string,
  args?: readonly string[],
  callback?: () => {}
) {
  const enableDebug = false
  const child = childProcess.spawn(command, (args ?? '') as readonly string[], {
    // encoding: 'utf8',
    shell: true,
  })
  // You can also use a variable to save the output for when the script closes later
  child.on('error', (error) => {
    if (enableDebug) {
      dialog.showMessageBox({
        title: 'Title',
        type: 'warning',
        message: `Error occured.\r\n${error}`,
      })
    }
  })

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (data) => {
    // Here is the output
    data = data.toString()

    if (enableDebug) {
      dialog.showMessageBox({
        title: 'Title',
        type: 'info',
        message: data,
      })
    }
  })

  child.stderr.setEncoding('utf8')
  child.stderr.on('data', (data) => {
    if (enableDebug) {
      dialog.showMessageBox({
        title: 'Title',
        type: 'info',
        message: data,
      })
    }
  })

  child.on('close', (code) => {
    // Here you can get the exit code of the scrip t
    switch (code) {
      case 0:
        if (enableDebug) {
          dialog.showMessageBox({
            title: 'Title',
            type: 'info',
            message: 'End process.\r\n',
          })
        }
        break
    }
  })
  if (typeof callback === 'function') callback()

  return child
}
