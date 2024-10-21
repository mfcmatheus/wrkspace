import { IpcMainEvent } from 'electron'
import { runScript } from '../util'

export const onServicesDocker = async (event: IpcMainEvent) => {
  const process = runScript(`/usr/local/bin/docker info`, [''], () => ({}))

  process.stderr.on('data', (data) => {
    event.reply(
      'services.docker',
      !data.toString().includes('Is the docker daemon running?')
    )
  })
}

export const onServicesGit = async (event: IpcMainEvent) => {
  const gitPath = runScript(`which git`, [''], () => ({}))
  gitPath.stdout.on('data', (path) => {
    event.reply('services.git', !!path.toString().trim())
  })
}
