import React, { useMemo } from 'react'

import Workspace from 'renderer/@types/Workspace'
import WorkspaceListItemUninstalled from './WorkspaceListItemUninstalled'
import WorkspaceListItemArchived from './WorkspaceListItemArchived'
import WorkspaceListItemDefault from './WorkspaceListItemDefault'

interface WorkspaceListItemProps {
  workspace: Workspace
}

function WorkspaceListItem(props: WorkspaceListItemProps) {
  const { workspace } = props

  const isInstalled = useMemo(() => {
    return !!workspace.path
  }, [workspace])

  if (!isInstalled) {
    return <WorkspaceListItemUninstalled workspace={workspace} />
  }

  if (workspace.archived_at) {
    return <WorkspaceListItemArchived workspace={workspace} />
  }

  return <WorkspaceListItemDefault workspace={workspace} />
}

export default WorkspaceListItem
