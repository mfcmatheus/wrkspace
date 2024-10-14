import { selector } from 'recoil'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.currentTeam',
  get: ({ get }) => {
    const setting = get(SettingAtom)
    return setting.currentTeam || null
  },
})
