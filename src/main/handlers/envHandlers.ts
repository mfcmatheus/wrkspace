import { IpcMainEvent } from 'electron'

export const onEnvGet = (event: IpcMainEvent) => {
  event.reply('env.get', process.env)
  event.returnValue = process.env
}
