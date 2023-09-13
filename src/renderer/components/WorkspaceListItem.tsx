import React from 'react'
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
import WorkspaceListItemContext from './WorkspaceListItemContext'

interface WorkspaceListItemProps {
  workspace: Workspace
  onEdit?: (workspace: Workspace) => void
  onFavorite?: (workspace: Workspace) => void
}

const defaultProps = {
  onEdit: null,
  onFavorite: null,
}

function WorkspaceListItem(props: WorkspaceListItemProps) {
  const { workspace, onEdit, onFavorite } = props

  const { show: showContextMenu } = useContextMenu({
    id: workspace.id,
  })

  const onLaunch = () => {
    ipcRenderer.sendMessage('workspaces.open', workspace)
  }

  const onClickEdit = () => {
    return onEdit && onEdit(workspace)
  }

  const onClickFavorite = () => {
    return onFavorite && onFavorite(workspace)
  }

  const lastOpened = moment(workspace.opened_at, 'YYYY-MM-DD HH:mm:ss')
  const classes = classNames({
    'flex flex-col group rounded border border-[#353535] hover:border-indigo-600 p-3 transition ease-in-out duration-200':
      true,
    '!border-[#857000]': workspace.favorite,
  })

  const renderDate = () => {
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
  }

  function handleContextMenu(
    event: React.MouseEventHandler<HTMLDivElement, MouseEvent>
  ) {
    showContextMenu({ event })
  }

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
        onEdit={onClickEdit}
        onLaunch={onLaunch}
        onFavorite={onClickFavorite}
      />
    </>
  )
}

WorkspaceListItem.defaultProps = defaultProps

export default WorkspaceListItem
