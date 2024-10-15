import React from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import WorkspaceListByFilterSelector from 'renderer/store/selectors/WorkspaceListByFilterSelector'
import MenuMainDefault from './MenuMainDefault'

export default function MenuMainArchived() {
  const [currentFilter, workspaces] = useRecoilValue(
    waitForAll([
      SettingCurrentFilterSelector,
      WorkspaceListByFilterSelector('archived'),
    ])
  )

  const updateSettings = useSetRecoilState(SettingDefaultSelector)

  return (
    <MenuMainDefault
      active={currentFilter === 'archived'}
      icon="Archive"
      name="Archived"
      count={workspaces.length}
      callback={() =>
        updateSettings({ currentFilter: 'archived', currentFolder: null })
      }
    />
  )
}
