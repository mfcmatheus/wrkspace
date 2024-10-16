import React, { useCallback, useMemo } from 'react'
import moment from 'moment'

import { useContextMenu } from 'react-contexify'
import classNames from 'classnames'
import WorkspaceListItemName from 'renderer/components/WorkspaceListItemName'
import WorkspaceListItemLastOpened from 'renderer/components/WorkspaceListItemLastOpened'
import WorkspaceListItemLaunch from 'renderer/components/WorkspaceListItemLaunch'
import WorkspaceListItemFeatures from 'renderer/components/WorkspaceListItemFeatures'

import Workspace from 'renderer/@types/Workspace'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import Folder from 'renderer/@types/Folder'
import ShadowMain from 'renderer/base-components/ShadowMain'
import WorkspaceListItemContext from 'renderer/components/WorkspaceListItemContext'
import Lucide from 'renderer/base-components/lucide'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import { useSetting } from 'renderer/contexts/SettingContext'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import initials from 'renderer/helpers/initials'
import { useProcess } from 'renderer/contexts/ProcessContext'
import WorkspaceListItemPath from './WorkspaceListItemPath'
import BorderLoader from './BorderLoader'

interface WorkspaceListItemProps {
  workspace: Workspace
  folders: Folder[]
  onEdit?: (workspace: Workspace) => void
  onFavorite?: (workspace: Workspace) => void
  onSetFolder?: (workspace: Workspace, folder: Folder | undefined) => void
  onInstall?: (workspace: Workspace) => void
}

const defaultProps = {
  onEdit: null,
  onFavorite: null,
  onSetFolder: null,
  onInstall: null,
}

function WorkspaceListItem(props: WorkspaceListItemProps) {
  const { workspace, folders, onEdit, onFavorite, onSetFolder, onInstall } =
    props
  const { currentView } = useSetting()
  const { getProcessesByWorkspace } = useProcess()
  const { show: showContextMenu } = useContextMenu({
    id: workspace.id,
  })

  const isRunning = useMemo(() => {
    const processes = getProcessesByWorkspace(workspace)
    return processes.length > 0
  }, [getProcessesByWorkspace, workspace])

  const onLaunch = useCallback(() => {
    ipcRenderer.sendMessage('workspaces.open', workspace)
  }, [workspace])

  const onNewTerminal = useCallback(() => {
    ipcRenderer.sendMessage('process.open', workspace)
  }, [workspace])

  const onClickEdit = useCallback(() => {
    return onEdit?.(workspace)
  }, [workspace, onEdit])

  const onClickFavorite = useCallback(() => {
    return onFavorite?.(workspace)
  }, [workspace, onFavorite])

  const onClickSetFolder = useCallback(
    (workspaceParam: Workspace, folder: Folder | undefined) => {
      return onSetFolder?.(workspaceParam, folder)
    },
    [onSetFolder]
  )

  const onClickUninstall = useCallback(() => {
    ipcRenderer.sendMessage('workspaces.uninstall', workspace)
  }, [workspace])

  const onClickInstall = useCallback(() => {
    return onInstall?.(workspace)
  }, [workspace, onInstall])

  const lastOpened = useMemo(
    () => moment(workspace.opened_at, 'YYYY-MM-DD HH:mm:ss'),
    [workspace]
  )

  const isInstalled = useMemo(() => {
    return !!workspace.path
  }, [workspace])

  const classes = useMemo(
    () =>
      classNames({
        'flex group rounded border border-transparent p-3 transition ease-in-out duration-200 !border-[#353535]':
          true,
        'flex-col': currentView === DashboardViews.GRID,
        'flex-row items-center gap-x-3': currentView === DashboardViews.LIST,
        'hover:!border-highlight-primary': !workspace.favorite,
        'bg-[#353535]/25': !isInstalled,
      }),
    [workspace, isInstalled, currentView]
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
    return workspace.favorite ? ShadowMain : 'div'
  }, [workspace.favorite, isRunning])

  if (!isInstalled) {
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
      <WorkspaceListItemContext
        id={workspace.id}
        workspace={workspace}
        folders={folders}
        onEdit={onClickEdit}
        onLaunch={onLaunch}
        onNewTerminal={onNewTerminal}
        onFavorite={onClickFavorite}
        onSetFolder={onClickSetFolder}
        onUninstall={onClickUninstall}
      />
    </>
  )
}

WorkspaceListItem.defaultProps = defaultProps

export default WorkspaceListItem
