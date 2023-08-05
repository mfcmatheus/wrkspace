import React from 'react'

import WorkspaceListItemName from 'renderer/components/WorkspaceListItemName'
import WorkspaceListItemLastOpened from 'renderer/components/WorkspaceListItemLastOpened'
import WorkspaceListItemLaunch from 'renderer/components/WorkspaceListItemLaunch'

import Workspace from 'renderer/@types/Workspace'

interface WorkspaceListItemProps {
  workspace: Workspace
  onClick?: (workspace: Workspace) => void
}

const defaultProps = {
  onClick: () => {},
}

function WorkspaceListItem(props: WorkspaceListItemProps) {
  const { workspace, onClick } = props

  return (
    <div
      aria-hidden="true"
      className="flex flex-col group rounded border border-[#353535] hover:border-indigo-600 cursor-pointer p-3 transition ease-in-out duration-200"
      onClick={() => onClick && onClick(workspace)}
    >
      <WorkspaceListItemName>Workspace Name</WorkspaceListItemName>
      <WorkspaceListItemLastOpened>
        Opened 2 days ago
      </WorkspaceListItemLastOpened>
      <WorkspaceListItemLaunch />
    </div>
  )
}

WorkspaceListItem.defaultProps = defaultProps

export default WorkspaceListItem
