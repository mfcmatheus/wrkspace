import { selector } from 'recoil'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import SettingAtom from '../atoms/SettingAtom'

export default selector({
  key: 'settings.currentView',
  get: ({ get }) => {
    const setting = get(SettingAtom)
    return setting.currentView || DashboardViews.GRID
  },
})
