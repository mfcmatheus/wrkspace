import { selector } from 'recoil'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.currentFilter',
  get: ({ get }) => {
    return get(SettingAtom).currentFilter || null
  },
})
