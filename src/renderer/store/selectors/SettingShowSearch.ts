import { selector } from 'recoil'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.showSearch',
  get: ({ get }) => {
    const setting = get(SettingAtom)
    return setting.showSearch !== undefined ? setting.showSearch : false
  },
})
