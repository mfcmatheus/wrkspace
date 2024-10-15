import React from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingCurrentFolderSelector from 'renderer/store/selectors/SettingCurrentFolderSelector'
import WorkspaceAtom from 'renderer/store/atoms/WorkspaceAtom'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import MenuMainDefault from './MenuMainDefault'

export default function MenuMainDashboard() {
  const [currentFilter, currentFolder, workspaces] = useRecoilValue(
    waitForAll([
      SettingCurrentFilterSelector,
      SettingCurrentFolderSelector,
      WorkspaceAtom,
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
