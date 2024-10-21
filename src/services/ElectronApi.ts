import { ipcRenderer } from 'renderer/hooks/useIpc'

const call = (channel: string, data?: object) => {
  return ipcRenderer.sendSync(channel, data)
}

export default {
  call,
}
