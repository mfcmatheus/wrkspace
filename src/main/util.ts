/* eslint import/prefer-default-export: off */
import { URL } from 'url'
import path from 'path'

import childProcess from 'child_process'
import { dialog } from 'electron'

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

export function runScript(
  command: string,
  args?: readonly string[],
  callback?: () => {}
) {
  const child = childProcess.spawn(command, (args ?? '') as readonly string[], {
    encoding: 'utf8',
    shell: true,
  })
  // You can also use a variable to save the output for when the script closes later
  child.on('error', (error) => {
    dialog.showMessageBox({
      title: 'Title',
      type: 'warning',
      message: `Error occured.\r\n${error}`,
    })
  })

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (data) => {
    // Here is the output
    data = data.toString()
    console.log(data)
  })

  child.stderr.setEncoding('utf8')
  child.stderr.on('data', (data) => {
    // Return some data to the renderer process with the mainprocess-response ID
    mainWindow.webContents.send('mainprocess-response', data)
    // Here is the output from the command
    console.log(data)
  })

  child.on('close', (code) => {
    // Here you can get the exit code of the script
    switch (code) {
      case 0:
        /* dialog.showMessageBox({
          title: 'Title',
          type: 'info',
          message: 'End process.\r\n',
        }) */
        break
    }
  })
  if (typeof callback === 'function') callback()
}
