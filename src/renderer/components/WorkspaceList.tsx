import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import WorkspaceListSelector from 'renderer/store/selectors/WorkspaceListSelector'
import Lucide from 'renderer/base-components/lucide'
import WorkspaceListItem from './WorkspaceListItem'

function WorkspaceList() {
  const navigate = useNavigate()
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

  const onClickCreateWorkspace = useCallback(() => {
    return navigate('/new')
  }, [navigate])

  return (
    <div className="flex flex-grow basis-full overflow-auto items-start p-3">
      <div className={gridClasses}>
        <button
          type="button"
          className="cursor-default flex items-center justify-center h-full min-h-[164px] border border-dashed border-border rounded-md"
          onClick={onClickCreateWorkspace}
        >
          <div className="flex flex-col items-center">
            <Lucide icon="Plus" size={32} strokeWidth={1} />
            <span className="font-light">Create workspace</span>
          </div>
        </button>
        {workspaces.map((workspace) => (
          <WorkspaceListItem
            key={workspace.path ? workspace.id : `${workspace.id}-preview`}
            workspace={workspace}
          />
        ))}
      </div>
    </div>
  )
}

export default WorkspaceList
