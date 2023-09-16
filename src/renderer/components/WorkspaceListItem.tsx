import React, { useCallback, useMemo } from 'react'
import moment from 'moment'

import { useContextMenu } from 'react-contexify'
import classNames from 'classnames'
import WorkspaceListItemName from 'renderer/components/WorkspaceListItemName'
import WorkspaceListItemLastOpened from 'renderer/components/WorkspaceListItemLastOpened'
import WorkspaceListItemLaunch from 'renderer/components/WorkspaceListItemLaunch'
import WorkspaceListItemEdit from 'renderer/components/WorkspaceListItemEdit'
import WorkspaceListItemFeatures from 'renderer/components/WorkspaceListItemFeatures'

import Workspace from 'renderer/@types/Workspace'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import Folder from 'renderer/@types/Folder'
import WorkspaceListItemContext from './WorkspaceListItemContext'

interface WorkspaceListItemProps {
  workspace: Workspace
  folders: Folder[]
  onEdit?: (workspace: Workspace) => void
  onFavorite?: (workspace: Workspace) => void
  onSetFolder?: (workspace: Workspace, folder: Folder | undefined) => void
}

const defaultProps = {
  onEdit: null,
  onFavorite: null,
  onSetFolder: null,
}

function WorkspaceListItem(props: WorkspaceListItemProps) {
  const { workspace, folders, onEdit, onFavorite, onSetFolder } = props

  const { show: showContextMenu } = useContextMenu({
    id: workspace.id,
  })

  const onLaunch = useCallback(() => {
    ipcRenderer.sendMessage('workspaces.open', workspace)
  }, [workspace])

  const onClickEdit = useCallback(() => {
    return onEdit && onEdit(workspace)
  }, [workspace, onEdit])

  const onClickFavorite = useCallback(() => {
    return onFavorite && onFavorite(workspace)
  }, [workspace, onFavorite])

  const onClickSetFolder = useCallback(
    (workspaceParam: Workspace, folder: Folder | undefined) => {
      return onSetFolder && onSetFolder(workspaceParam, folder)
    },
    [onSetFolder]
  )

  const lastOpened = useMemo(
    () => moment(workspace.opened_at, 'YYYY-MM-DD HH:mm:ss'),
    [workspace]
  )
  const classes = useMemo(
    () =>
      classNames({
        'flex flex-col group rounded border border-[#353535] hover:border-indigo-600 p-3 transition ease-in-out duration-200':
          true,
        '!border-[#857000]': workspace.favorite,
      }),
    [workspace]
  )

  const renderDate = useCallback(() => {
    if (!lastOpened.isValid()) {
      return <>Never opened</>
    }

    const keys = [
      'years',
      'months',
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
    ]

    let result = ''

    keys.forEach((key) => {
      const diff = moment().diff(lastOpened, key)

      if (!result && diff) {
        result = `Opened ${diff} ${key} ago`
      }
    })

    return result
  }, [lastOpened])

  const handleContextMenu = useCallback(
    (event: React.MouseEventHandler<HTMLDivElement, MouseEvent>) => {
      showContextMenu({ event })
    },
    [showContextMenu]
  )

  return (
    <>
      <div onContextMenu={handleContextMenu} className={classes}>
        <div className="flex items-center h-[20px]">
          <WorkspaceListItemFeatures workspace={workspace} />
          {/* <WorkspaceListItemEdit onClick={onClickEdit} /> */}
        </div>
        <WorkspaceListItemName>{workspace.name}</WorkspaceListItemName>
        <WorkspaceListItemLastOpened>
          {renderDate()}
        </WorkspaceListItemLastOpened>
        <WorkspaceListItemLaunch workspace={workspace} onClick={onLaunch} />
      </div>
      <WorkspaceListItemContext
        id={workspace.id}
        workspace={workspace}
        folders={folders}
        onEdit={onClickEdit}
        onLaunch={onLaunch}
        onFavorite={onClickFavorite}
        onSetFolder={onClickSetFolder}
      />
    </>
  )
}

WorkspaceListItem.defaultProps = defaultProps

export default WorkspaceListItem
