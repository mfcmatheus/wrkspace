import { IpcMainEvent, BrowserWindow, dialog } from 'electron'

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
    const filePath = filePaths[0]
    event.returnValue = filePath
  } else {
    event.returnValue = null
  }
}
