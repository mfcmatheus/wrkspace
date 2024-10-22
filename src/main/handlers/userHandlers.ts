import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import User from 'renderer/@types/User'
import { runScript } from '../util'

const store = new Store()

export const onUserGet = (event: IpcMainEvent) => {
  const user = store.get('user') ?? null
  event.reply('user.get', user)
}

export const onUserSet = (event: IpcMainEvent, user: User) => {
  if (!user) return
  store.set('user', user)
}

export const onUserAuthenticate = async (event: IpcMainEvent) => {
  runScript(`open '${process.env.APP_URL}/authorize'`, [''], () => ({}))
  event.returnValue = true
}

export const onUserUpgrade = async (event: IpcMainEvent) => {
  runScript(`open '${process.env.APP_URL}/signup'`, [''], () => ({}))
}

export const onUserToken = (event: IpcMainEvent) => {
  const token = store.get('token') ?? null
  event.reply('token.get', token)
  event.returnValue = token
}

export const onUserLogout = async (event: IpcMainEvent) => {
  store.delete('user')
  store.delete('token')
  event.reply('user.logout')
}
