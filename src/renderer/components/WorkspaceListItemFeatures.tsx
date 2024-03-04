import classNames from 'classnames'
import React, { useMemo } from 'react'
import { DashboardViews } from 'renderer/@enums/DashboardViews'

import Workspace from 'renderer/@types/Workspace'
import Lucide from 'renderer/base-components/lucide'
import { useSetting } from 'renderer/contexts/SettingContext'
import { useUser } from 'renderer/contexts/UserContext'
import useWorkspace from 'renderer/hooks/useWorkspace'

interface WorkspaceListItemFeaturesProps {
  workspace: Workspace
}

function WorkspaceListItemFeatures(props: WorkspaceListItemFeaturesProps) {
  const { workspace } = props

  const { hasCloudSync } = useUser()
  const { hasSyncEnabled } = useWorkspace(workspace)
  const { currentView } = useSetting()

  const classes = useMemo(
    () =>
      classNames({
        'flex flex-1 ': true,
        'gap-x-1': currentView === DashboardViews.GRID,
        'gap-x-2': currentView === DashboardViews.LIST,
      }),
    [currentView]
  )

  return (
    <div className={classes}>
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
      {hasSyncEnabled && hasCloudSync && (
        <Lucide icon="Cloud" className="ml-auto" size={14} color="#d2d2d2" />
      )}
    </div>
  )
}

export default WorkspaceListItemFeatures
