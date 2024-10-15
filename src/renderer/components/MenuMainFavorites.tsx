import React from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import WorkspaceListByFilterSelector from 'renderer/store/selectors/WorkspaceListByFilterSelector'
import MenuMainDefault from './MenuMainDefault'

export default function MenuMainFavorites() {
  const [currentFilter, workspaces] = useRecoilValue(
    waitForAll([
      SettingCurrentFilterSelector,
      WorkspaceListByFilterSelector('favorites'),
    ])
  )

  const updateSettings = useSetRecoilState(SettingDefaultSelector)

  return (
    <MenuMainDefault
      active={currentFilter === 'favorites'}
      icon="Star"
      name="Favorites"
      count={workspaces.length}
      callback={() =>
        updateSettings({ currentFilter: 'favorites', currentFolder: null })
      }
    />
  )
}
