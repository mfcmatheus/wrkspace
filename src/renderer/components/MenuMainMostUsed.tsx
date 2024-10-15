import React from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import WorkspaceListByFilterSelector from 'renderer/store/selectors/WorkspaceListByFilterSelector'
import MenuMainDefault from './MenuMainDefault'

export default function MenuMainMostUsed() {
  const [currentFilter, workspaces] = useRecoilValue(
    waitForAll([
      SettingCurrentFilterSelector,
      WorkspaceListByFilterSelector('most_used'),
    ])
  )

  const updateSettings = useSetRecoilState(SettingDefaultSelector)

  return (
    <MenuMainDefault
      active={currentFilter === 'most_used'}
      icon="TrendingUp"
      name="Most used"
      count={workspaces.length}
      callback={() =>
        updateSettings({ currentFilter: 'most_used', currentFolder: null })
      }
    />
  )
}
