import { IpcMainEvent } from 'electron'
import { runScript } from '../util'

export const onContainersGet = async (event: IpcMainEvent) => {
  const process = runScript(
    `/usr/local/bin/docker container ls -a --format '{"ID":"{{.ID}}","Names":"{{.Names}}"}'`,
    [''],
    () => ({})
  )

  process.stdout.on('data', (data) => {
    event.reply('containers.get', data.toString())
  })
}
