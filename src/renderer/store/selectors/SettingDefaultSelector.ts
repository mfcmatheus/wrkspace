import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.get',
  get: () => {
    return ElectronApi.call('settings.get', {})
  },
  set: ({ set, get }, newValue) => {
    const settings = get(SettingAtom)
    set(SettingAtom, { ...settings, ...newValue })
    ElectronApi.call('settings.update', { ...settings, ...newValue })
  },
})
