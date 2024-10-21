import React, { useCallback, useMemo } from 'react'
import moment from 'moment'

import { useContextMenu } from 'react-contexify'
import classNames from 'classnames'
import { useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import WorkspaceListItemName from 'renderer/components/WorkspaceListItemName'
import WorkspaceListItemLastOpened from 'renderer/components/WorkspaceListItemLastOpened'
import WorkspaceListItemLaunch from 'renderer/components/WorkspaceListItemLaunch'
import WorkspaceListItemFeatures from 'renderer/components/WorkspaceListItemFeatures'

import Workspace from 'renderer/@types/Workspace'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import ShadowMain from 'renderer/base-components/ShadowMain'
import WorkspaceListItemDefaultContext from 'renderer/components/WorkspaceListItemDefaultContext'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import initials from 'renderer/helpers/initials'
import FolderAtom from 'renderer/store/atoms/FolderAtom'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import ElectronApi from 'services/ElectronApi'
import ProcessByWorkspace from 'renderer/store/selectors/ProcessByWorkspace'
import Process from 'renderer/@types/Process'
import WorkspaceAtom from 'renderer/store/atoms/WorkspaceAtom'
import WorkspaceListItemPath from './WorkspaceListItemPath'
import BorderLoader from './BorderLoader'

interface Props {
  workspace: Workspace
}

export default function WorkspaceListItemDefault(props: Props) {
  const { workspace } = props
  const setWorkspaces = useSetRecoilState(WorkspaceAtom)
  const [folders, settings] = useRecoilValue(
    waitForAll([FolderAtom, SettingAtom])
  )
  const { currentView } = settings
  const { show: showContextMenu } = useContextMenu({
    id: workspace.id,
  })

  const workspaceProcesses = useRecoilValue(ProcessByWorkspace(workspace))

  const isRunning = useMemo(() => {
    return workspaceProcesses.length > 0
  }, [workspaceProcesses])

  const onLaunch = useCallback(() => {
    const workspaces = ElectronApi.call('workspaces.open', workspace)
    setWorkspaces(workspaces)
  }, [workspace, setWorkspaces])

  const onNewTerminal = useCallback(() => {
    ipcRenderer.sendMessage('process.open', workspace)
  }, [workspace])

  const onClickUninstall = useCallback(() => {
    ipcRenderer.sendMessage('workspaces.uninstall', workspace)
  }, [workspace])

  const lastOpened = useMemo(
    () => moment(workspace.opened_at, 'YYYY-MM-DD HH:mm:ss'),
    [workspace]
  )

  const classes = useMemo(
    () =>
      classNames({
        'relative bg-muted flex group rounded border border-transparent p-3 !border-border z-[2]':
          true,
        'flex-col': currentView === DashboardViews.GRID,
        'flex-row items-center gap-x-3': currentView === DashboardViews.LIST,
        'hover:!border-primary': !isRunning && !workspace.favorite,
        '!border-primary': workspace.favorite && !isRunning,
      }),
    [workspace, currentView, isRunning]
  )

  const renderDate = useMemo(() => {
    if (!lastOpened.isValid()) {
      return <>Never opened</>
    }

    const keys = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']

    let result = ''

    keys.forEach((key) => {
      let correctKey = key
      const diff = moment().diff(lastOpened, key)

      if (!result && diff) {
        if (diff > 1) correctKey += 's'
        result = `Opened ${diff} ${correctKey} ago`
      }
    })

    return result !== '' ? result : 'Opened < 1 second ago'
  }, [lastOpened])

  const handleContextMenu = useCallback(
    (event: React.MouseEventHandler<HTMLDivElement, MouseEvent>) => {
      showContextMenu({ event })
    },
    [showContextMenu]
  )

  const Element = useMemo(() => {
    if (isRunning) return BorderLoader
    return 'div'
    // return workspace.favorite ? ShadowMain : 'div'
  }, [workspace.favorite, isRunning])

  return (
    <>
      <Element
        className="rounded"
        shadowClassName="!rounded"
        wrapperClassName="rounded"
      >
        <div onContextMenu={handleContextMenu} className={classes}>
          <div
            className={classNames({
              'flex items-center ': true,
              'h-[20px]': currentView === DashboardViews.GRID,
              'order-3 w-2/12': currentView === DashboardViews.LIST,
            })}
          >
            <WorkspaceListItemFeatures workspace={workspace} />
          </div>
          <div
            className={classNames({
              'flex flex-col': true,
              'order-1 w-5/12': currentView === DashboardViews.LIST,
            })}
          >
            <WorkspaceListItemName>{workspace.name}</WorkspaceListItemName>
            <WorkspaceListItemPath>{workspace.path}</WorkspaceListItemPath>
          </div>
          {currentView === DashboardViews.LIST && workspace.folder?.name && (
            <span className="order-3 mx-auto uppercase text-zinc-400 font-light">
              {initials(workspace.folder?.name, 3)}
            </span>
          )}
          <WorkspaceListItemLastOpened>
            {renderDate}
          </WorkspaceListItemLastOpened>
          <WorkspaceListItemLaunch workspace={workspace} onClick={onLaunch} />
        </div>
      </Element>
      <WorkspaceListItemDefaultContext
        id={workspace.id}
        workspace={workspace}
        folders={folders}
        onLaunch={onLaunch}
        onNewTerminal={onNewTerminal}
        onUninstall={onClickUninstall}
      />
    </>
  )
}
