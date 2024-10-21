import classNames from 'classnames'
import moment from 'moment'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import { DashboardViews } from 'renderer/@enums/DashboardViews'

import Workspace from 'renderer/@types/Workspace'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import Lucide from 'renderer/base-components/lucide'
import useProcess from 'renderer/hooks/useProcess'
import ProcessByWorkspace from 'renderer/store/selectors/ProcessByWorkspace'
import SettingCurrentViewSelector from 'renderer/store/selectors/SettingCurrentViewSelector'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'

interface WorkspaceListItemLaunchProps {
  workspace: Workspace
  onClick?: () => void
}

const defaultProps = {
  onClick: () => {},
}

function WorkspaceListItemLaunch(props: WorkspaceListItemLaunchProps) {
  const { workspace, onClick } = props
  const { closeProcess } = useProcess()
  const updateWorkspace = useSetRecoilState(WorkspaceItemSelector(workspace.id))
  const [workspaceProcesses, currentView] = useRecoilValue(
    waitForAll([ProcessByWorkspace(workspace), SettingCurrentViewSelector])
  )

  const isRunning = useMemo(() => {
    return workspaceProcesses.length > 0
  }, [workspaceProcesses])

  const classes = useMemo(
    () =>
      classNames({
        'flex cursor-default font-light text-center text-[#f0f0f0]': true,
        '-mx-[13px] -mb-[13px] mt-1 rounded-b-[3px] bg-border flex-1 py-2':
          currentView === DashboardViews.GRID,
        'group-hover:bg-foreground group-hover:text-background': !isRunning,
        'order-5 ml-3': currentView === DashboardViews.LIST,
        'bg-primary !text-background': workspace.favorite && !isRunning,
        'group-hover:!bg-gradient-to-r':
          workspace.favorite && currentView === DashboardViews.GRID,
      }),
    [workspace, currentView, isRunning]
  )

  const onClose = useCallback(() => {
    updateWorkspace({
      ...workspace,
      activities: [
        ...(workspace.activities ?? []),
        {
          type: 'close',
          created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
    })
    // eslint-disable-next-line
    for (const process of workspaceProcesses) {
      closeProcess(process)
    }
  }, [closeProcess, workspaceProcesses, updateWorkspace, workspace])

  const onClickLaunch = useCallback(() => {
    return isRunning ? onClose() : onClick?.()
  }, [isRunning, onClick, onClose])

  if (workspace?.loading) {
    return (
      <button type="button" className={classes}>
        <div className="w-10 mx-auto py-1">
          <LoadingIcon icon="three-dots" color="#f0f0f0" />
        </div>
      </button>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClickLaunch}>
      {isRunning ? (
        <p className="uppercase text-xs mx-auto">
          {currentView === DashboardViews.GRID ? (
            <>Stop</>
          ) : (
            <span className="flex items-center">
              <Lucide icon="Square" size={20} color="#f0f0f0" strokeWidth={1} />
            </span>
          )}
        </p>
      ) : (
        <p className="uppercase text-xs mx-auto">
          {currentView === DashboardViews.GRID ? (
            <>Start</>
          ) : (
            <span className="flex items-center">
              <Lucide icon="Play" size={20} color="#f0f0f0" strokeWidth={1} />
            </span>
          )}
        </p>
      )}
    </button>
  )
}

WorkspaceListItemLaunch.defaultProps = defaultProps

export default WorkspaceListItemLaunch
