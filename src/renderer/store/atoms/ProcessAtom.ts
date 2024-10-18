import { atom } from 'recoil'
import Process from 'renderer/@types/Process'
import { ipcRenderer } from 'renderer/hooks/useIpc'

export default atom({
  key: 'processes',
  default: [] as Process[],
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const listener = ipcRenderer.on('processes.update', (event) => {
        setSelf(event)
      })

      return () => {
        ipcRenderer.removeListener('processes.update', listener)
      }
    },
  ],
})
