import React from 'react'
import moment from 'moment'

import WorkspaceListItemName from 'renderer/components/WorkspaceListItemName'
import WorkspaceListItemLastOpened from 'renderer/components/WorkspaceListItemLastOpened'
import WorkspaceListItemLaunch from 'renderer/components/WorkspaceListItemLaunch'
import WorkspaceListItemEdit from 'renderer/components/WorkspaceListItemEdit'
import WorkspaceListItemFeatures from 'renderer/components/WorkspaceListItemFeatures'

import Workspace from 'renderer/@types/Workspace'
import { ipcRenderer } from 'renderer/hooks/useIpc'

interface WorkspaceListItemProps {
  workspace: Workspace
  onEdit?: (workspace: Workspace) => void
}

const defaultProps = {
  onEdit: () => {},
}

function WorkspaceListItem(props: WorkspaceListItemProps) {
  const { workspace, onEdit } = props

  const onLaunch = () => {
    ipcRenderer.sendMessage('workspaces.open', workspace)
  }

  const onClickEdit = () => {
    return onEdit && onEdit(workspace)
  }

  const lastOpened = moment(workspace.opened_at, 'YYYY-MM-DD HH:mm:ss')

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

  return (
    <div className="flex flex-col group rounded border border-[#353535] hover:border-indigo-600 p-3 transition ease-in-out duration-200">
      <div className="flex items-center">
        <WorkspaceListItemFeatures workspace={workspace} />
        <WorkspaceListItemEdit onClick={onClickEdit} />
      </div>
      <WorkspaceListItemName>{workspace.name}</WorkspaceListItemName>
      <WorkspaceListItemLastOpened>{renderDate()}</WorkspaceListItemLastOpened>
      <WorkspaceListItemLaunch workspace={workspace} onClick={onLaunch} />
    </div>
  )
}

WorkspaceListItem.defaultProps = defaultProps

export default WorkspaceListItem
