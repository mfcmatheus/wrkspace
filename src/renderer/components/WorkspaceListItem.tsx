import React from 'react'

import WorkspaceListItemName from 'renderer/components/WorkspaceListItemName'
import WorkspaceListItemLastOpened from 'renderer/components/WorkspaceListItemLastOpened'
import WorkspaceListItemLaunch from 'renderer/components/WorkspaceListItemLaunch'

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

  return (
    <div
      aria-hidden="true"
      className="flex flex-col group rounded border border-[#353535] hover:border-indigo-600 cursor-pointer p-3 transition ease-in-out duration-200"
    >
      <div className="flex">
        <button
          type="button"
          className="ml-auto"
          onClick={() => onEdit && onEdit(workspace)}
        >
          edit
        </button>
      </div>
      <WorkspaceListItemName>{workspace.name}</WorkspaceListItemName>
      <WorkspaceListItemLastOpened>
        Opened 2 days ago
      </WorkspaceListItemLastOpened>
      <WorkspaceListItemLaunch onClick={onLaunch} />
    </div>
  )
}

WorkspaceListItem.defaultProps = defaultProps

export default WorkspaceListItem
