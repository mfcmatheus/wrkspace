import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import moment from 'moment'
import { useContextMenu } from 'react-contexify'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import Workspace from 'renderer/@types/Workspace'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import initials from 'renderer/helpers/initials'
import WorkspaceListItemFeatures from './WorkspaceListItemFeatures'
import WorkspaceListItemName from './WorkspaceListItemName'
import WorkspaceListItemPath from './WorkspaceListItemPath'
import WorkspaceListItemLastOpened from './WorkspaceListItemLastOpened'
import WorkspaceListItemArchivedContext from './WorkspaceListItemArchivedContext'

interface Props {
  workspace: Workspace
}

export default function WorkspaceListItemArchived(props: Props) {
  const { workspace } = props
  const [settings] = useRecoilValue(waitForAll([SettingAtom]))
  const { currentView } = settings
  const { show: showContextMenu } = useContextMenu({
    id: workspace.id,
  })

  const classes = useMemo(
    () =>
      classNames({
        'bg-border/50 flex group rounded border border-transparent p-3 transition ease-in-out duration-200 !border-border':
          true,
        'flex-col': currentView === DashboardViews.GRID,
        'flex-row items-center gap-x-3': currentView === DashboardViews.LIST,
      }),
    [currentView]
  )

  const archived = useMemo(
    () => moment(workspace.archived_at, 'YYYY-MM-DD HH:mm:ss'),
    [workspace]
  )

  const renderDate = useMemo(() => {
    if (!archived.isValid()) {
      return <>Never opened</>
    }

    const keys = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']

    let result = ''

    keys.forEach((key) => {
      let correctKey = key
      const diff = moment().diff(archived, key)

      if (!result && diff) {
        if (diff > 1) correctKey += 's'
        result = `Archived ${diff} ${correctKey} ago`
      }
    })

    return result !== '' ? result : 'Archived < 1 second ago'
  }, [archived])

  const handleContextMenu = useCallback(
    (event: React.MouseEventHandler<HTMLDivElement, MouseEvent>) => {
      showContextMenu({ event })
    },
    [showContextMenu]
  )

  return (
    <>
      <div className="rounded">
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
        </div>
      </div>
      <WorkspaceListItemArchivedContext
        id={workspace.id}
        workspace={workspace}
      />
    </>
  )
}
