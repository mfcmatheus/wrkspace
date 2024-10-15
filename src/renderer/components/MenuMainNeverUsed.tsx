import React from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import WorkspaceListByFilterSelector from 'renderer/store/selectors/WorkspaceListByFilterSelector'
import MenuMainDefault from './MenuMainDefault'

export default function MenuMainNeverUsed() {
  const [currentFilter, workspaces] = useRecoilValue(
    waitForAll([
      SettingCurrentFilterSelector,
      WorkspaceListByFilterSelector('never_used'),
    ])
  )

  const updateSettings = useSetRecoilState(SettingDefaultSelector)

  return (
    <MenuMainDefault
      active={currentFilter === 'never_used'}
      icon="File"
      name="Never used"
      count={workspaces.length}
      callback={() =>
        updateSettings({ currentFilter: 'never_used', currentFolder: null })
      }
    />
  )
}
