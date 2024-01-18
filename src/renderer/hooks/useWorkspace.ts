import React, { useMemo } from 'react'
import Workspace from 'renderer/@types/Workspace'
import { useCloudSync } from 'renderer/contexts/CloudSyncContext'

export default function useWorkspace(workspace: Workspace) {
  const { isSyncing } = useCloudSync()

  const hasSyncEnabled = useMemo(() => {
    return workspace.repo
  }, [workspace])

  const isSynced = useMemo(() => {
    const regex = /^[0-9]+$/
    return regex.test(workspace.id.toString()) && !isSyncing
  }, [workspace, isSyncing])

  return {
    hasSyncEnabled,
    isSynced,
  }
}
