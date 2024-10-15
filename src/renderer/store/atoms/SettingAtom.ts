import { atom } from 'recoil'
import Setting from 'renderer/@types/Setting'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import SettingDefaultSelector from '../selectors/SettingDefaultSelector'

export default atom({
  key: 'settings',
  default: SettingDefaultSelector as Setting,
  effects: [
    ({ setSelf }) => {
      const eventHandler = ipcRenderer.on('settings.reload', setSelf)

      return () => {
        ipcRenderer.removeListener('settings.reload', eventHandler)
      }
    },
  ],
})
