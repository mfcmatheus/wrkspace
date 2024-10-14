import { selector } from 'recoil'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.isMenuFolderOpened',
  get: ({ get }) => {
    const setting = get(SettingAtom)
    return setting.isMenuFolderOpened !== undefined
      ? setting.isMenuFolderOpened
      : true
  },
})
