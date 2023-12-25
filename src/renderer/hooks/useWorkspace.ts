import React, { useMemo } from 'react'
import Workspace from 'renderer/@types/Workspace'

export default function useWorkspace(workspace: Workspace) {
  const hasSyncEnabled = useMemo(() => {
    return (
      workspace.repo &&
      (workspace.installation?.commands?.length ||
        workspace.installation?.variables?.length)
    )
  }, [workspace])

  return {
    hasSyncEnabled,
  }
}
