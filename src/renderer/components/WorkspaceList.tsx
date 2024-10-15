import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import WorkspaceListSelector from 'renderer/store/selectors/WorkspaceListSelector'
import WorkspaceListItem from './WorkspaceListItem'

function WorkspaceList() {
  const [workspaces, settings] = useRecoilValue(
    waitForAll([WorkspaceListSelector, SettingAtom])
  )

  const gridClasses = useMemo(
    () =>
      classNames({
        'grid justify-start items-start gap-3 w-full': true,
        'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5':
          settings.currentView === DashboardViews.GRID,
        'grid-cols-1': settings.currentView === DashboardViews.LIST,
      }),
    [settings.currentView]
  )

  return (
    <div className="flex flex-grow basis-full overflow-auto items-start p-4">
      <div className={gridClasses}>
        {workspaces.map((workspace) => (
          <WorkspaceListItem
            key={workspace.path ? workspace.id : `${workspace.id}-preview`}
            workspace={workspace}
            // onEdit={onEditWorkspace}
            // onFavorite={onFavorite}
            // onSetFolder={onSetFolder}
            // onInstall={onInstall}
          />
        ))}
      </div>
    </div>
  )
}

export default WorkspaceList
