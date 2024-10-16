import React from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingCurrentFolderSelector from 'renderer/store/selectors/SettingCurrentFolderSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import WorkspaceListByFilterSelector from 'renderer/store/selectors/WorkspaceListByFilterSelector'
import MenuMainDefault from './MenuMainDefault'

export default function MenuMainDashboard() {
  const [currentFilter, currentFolder, workspaces] = useRecoilValue(
    waitForAll([
      SettingCurrentFilterSelector,
      SettingCurrentFolderSelector,
      WorkspaceListByFilterSelector(''),
    ])
  )

  const updateSettings = useSetRecoilState(SettingDefaultSelector)

  return (
    <MenuMainDefault
      active={!currentFilter && !currentFolder}
      icon="LayoutGrid"
      name="Dashboard"
      count={workspaces.length}
      callback={() =>
        updateSettings({ currentFilter: null, currentFolder: null })
      }
    />
  )
}
