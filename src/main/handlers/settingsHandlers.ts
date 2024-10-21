import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import Setting from 'renderer/@types/Setting'

const store = new Store()

export const onSettingsGet = async (event: IpcMainEvent) => {
  event.reply('settings.get', (store.get('settings') ?? {}) as Setting)
  event.returnValue = (store.get('settings') ?? {}) as Setting
}

export const onSettingsUpdate = async (
  event: IpcMainEvent,
  settings: Setting
) => {
  const setting = (store.get('settings') ?? {}) as Setting
  store.set('settings', { ...setting, ...settings } as Setting)
  event.reply('settings.reload', { ...setting, ...settings })
  event.returnValue = { ...setting, ...settings }
}
