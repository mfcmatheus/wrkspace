import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { DashboardViews } from 'renderer/@enums/DashboardViews'

import Workspace from 'renderer/@types/Workspace'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import Lucide from 'renderer/base-components/lucide'
import { useProcess } from 'renderer/contexts/ProcessContext'
import { useSetting } from 'renderer/contexts/SettingContext'

interface WorkspaceListItemLaunchProps {
  workspace: Workspace
  onClick?: () => void
}

const defaultProps = {
  onClick: () => {},
}

function WorkspaceListItemLaunch(props: WorkspaceListItemLaunchProps) {
  const { workspace, onClick } = props
  const { currentView } = useSetting()
  const { getProcessesByWorkspace, closeProcess } = useProcess()

  const isRunning = useMemo(() => {
    const processes = getProcessesByWorkspace(workspace)
    return processes.length > 0
  }, [getProcessesByWorkspace, workspace])

  const classes = useMemo(
    () =>
      classNames({
        'flex cursor-pointer text-center transition ease-in-out duration-200':
          true,
        '-mx-[13px] -mb-[13px] mt-1 rounded-b-[3px] bg-[#353535] flex-1 py-2 group-hover:bg-highlight-primary':
          currentView === DashboardViews.GRID,
        'order-5 ml-3': currentView === DashboardViews.LIST,
        'from-highlight-primary to-highlight-secondary': workspace.favorite,
        'group-hover:!bg-gradient-to-r':
          workspace.favorite && currentView === DashboardViews.GRID,
      }),
    [workspace, currentView]
  )

  const onClose = useCallback(() => {
    // eslint-disable-next-line
    for (const process of getProcessesByWorkspace(workspace)) {
      closeProcess(process)
    }
  }, [closeProcess, getProcessesByWorkspace, workspace])

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
        <p className="uppercase text-[#f0f0f0] font-thin text-xs mx-auto">
          {currentView === DashboardViews.GRID ? (
            <>Stop</>
          ) : (
            <span className="flex items-center">
              <Lucide icon="Square" size={20} color="#f0f0f0" strokeWidth={1} />
            </span>
          )}
        </p>
      ) : (
        <p className="uppercase text-[#f0f0f0] font-thin text-xs mx-auto">
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
