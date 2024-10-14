import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.get',
  get: () => {
    return ElectronApi.call('settings.get', {})
  },
  set: ({ set }, newValue) => {
    set(SettingAtom, newValue)
    ElectronApi.call('settings.update', newValue)
  },
})
