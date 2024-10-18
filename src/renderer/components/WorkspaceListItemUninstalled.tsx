import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useRecoilValue, waitForAll } from 'recoil'
import ShadowMain from 'renderer/base-components/ShadowMain'
import Workspace from 'renderer/@types/Workspace'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import Lucide from 'renderer/base-components/lucide'
import Process from 'renderer/@types/Process'
import ProcessByWorkspace from 'renderer/store/selectors/ProcessByWorkspace'
import BorderLoader from './BorderLoader'
import WorkspaceListItemName from './WorkspaceListItemName'
import WorkspaceListItemPath from './WorkspaceListItemPath'

interface Props {
  workspace: Workspace
}

export default function WorkspaceListItemUninstalled(props: Props) {
  const { workspace } = props
  const [settings] = useRecoilValue(waitForAll([SettingAtom]))
  const { currentView } = settings

  const workspaceProcesses = useRecoilValue<Process[]>(
    ProcessByWorkspace(workspace)
  )

  const isRunning = useMemo(() => {
    return workspaceProcesses.length > 0
  }, [workspaceProcesses])

  const classes = useMemo(
    () =>
      classNames({
        'bg-muted flex group rounded border border-transparent p-3 transition ease-in-out duration-200 !border-border bg-border/25':
          true,
        'flex-col': currentView === DashboardViews.GRID,
        'flex-row items-center gap-x-3': currentView === DashboardViews.LIST,
        'hover:!border-foreground': !workspace.favorite,
      }),
    [workspace, currentView]
  )

  const Element = useMemo(() => {
    if (isRunning) return BorderLoader
    return workspace.favorite ? ShadowMain : 'div'
  }, [workspace.favorite, isRunning])

  const onClickInstall = useCallback(() => {
    //
  }, [])

  return (
    <Element
      className="rounded"
      shadowClassName="!rounded"
      wrapperClassName="rounded"
    >
      <div className={classes}>
        {currentView === DashboardViews.GRID && (
          <div className="flex items-center h-[20px]" />
        )}
        <div className="flex flex-col w-full">
          <WorkspaceListItemName>{workspace.name}</WorkspaceListItemName>
          <WorkspaceListItemPath>Not installed</WorkspaceListItemPath>
        </div>
        {workspace.loading ? (
          <LoadingIcon
            icon="oval"
            className={classNames({
              'mx-auto': true,
              'w-[2.4rem]': currentView === DashboardViews.GRID,
              'w-[1.5rem]': currentView === DashboardViews.LIST,
            })}
            color="#f0f0f0"
          />
        ) : (
          <button
            type="button"
            className="flex mx-auto"
            onClick={onClickInstall}
          >
            <Lucide
              icon="DownloadCloud"
              size={currentView === DashboardViews.GRID ? 38 : 24}
              color="#6f6f6f"
              strokeWidth={1}
            />
          </button>
        )}
      </div>
    </Element>
  )
}
