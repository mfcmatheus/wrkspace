import React from 'react'

import Workspace from 'renderer/@types/Workspace'
import Lucide from 'renderer/base-components/lucide'

interface WorkspaceListItemFeaturesProps {
  workspace: Workspace
}

function WorkspaceListItemFeatures(props: WorkspaceListItemFeaturesProps) {
  const { workspace } = props

  return (
    <div className="flex gap-x-1">
      {!!workspace.features?.enableEditor && (
        <Lucide icon="AlignLeft" size={14} color="#d2d2d2" />
      )}
      {!!workspace.terminals?.length && (
        <Lucide icon="TerminalSquare" size={14} color="#d2d2d2" />
      )}
      {workspace.features?.enableDocker && (
        <Lucide icon="Container" size={14} color="#d2d2d2" />
      )}
      {!!workspace.browsers?.length && (
        <Lucide icon="Globe" size={14} color="#d2d2d2" />
      )}
    </div>
  )
}

export default WorkspaceListItemFeatures
