import { selector } from 'recoil'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.currentFolder',
  get: ({ get }) => {
    return get(SettingAtom).currentFolder
  },
})
