import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLazyQuery } from '@apollo/client'
import moment from 'moment'
import client from 'renderer/graphql/client'
import WorkspacesIdsQuery from 'renderer/graphql/queries/WorkspacesIdsQuery'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Workspace from 'renderer/@types/Workspace'
import { useUser } from './UserContext'

export interface props {
  children: React.ReactNode
}

export interface ICloudSyncContext {
  isSyncing: boolean
  progress: number
}

export const CloudSyncContext = createContext<ICloudSyncContext>(
  {} as ICloudSyncContext
)

export const useCloudSync = () => {
  const context = useContext<ICloudSyncContext>(CloudSyncContext)

  if (!context) {
    throw new Error('useCloudSync must be used within a CloudSync provider')
  }

  return context
}

export function CloudSyncProvider(props: props) {
  const { children } = props
  const { hasCloudSync } = useUser()

  const apolloClient = useMemo(() => client('/user'), [])

  const [getWorkspacesIds] = useLazyQuery(WorkspacesIdsQuery, {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [newData, setNewData] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)

  const progress = useMemo(() => {
    const value = 0

    return value
  }, [])

  const toDownload = useMemo(() => {
    if (!workspaces.length || !newData.length) return []

    return newData.filter((item) => {
      const relative = workspaces.find((workspace) => workspace.id === item.id)

      return relative
        ? moment(item.updated_at).isAfter(relative.updated_at ?? moment())
        : true
    })
  }, [workspaces, newData])
  const toUpload = useMemo(() => {
    if (!workspaces.length || !newData.length) return []

    return workspaces.filter((item) => {
      const relative = newData.find((workspace) => workspace.id === item.id)

      return relative
        ? moment(item.updated_at ?? moment()).isAfter(relative.updated_at)
        : true
    })
  }, [workspaces, newData])

  const getNewData = useCallback(async () => {
    const {
      data: { Workspaces: data },
    } = await getWorkspacesIds()

    setNewData(data)
  }, [getWorkspacesIds])

  const handleUpload = useCallback(async () => {
    console.log('handleUpload')
  }, [])
  const handleDownload = useCallback(async () => {
    console.log('handleDownload')
  }, [])

  useEffect(() => {
    if (!hasCloudSync) return
    ipcRenderer.sendMessage('workspaces.get')
  }, [hasCloudSync])

  useEffect(() => {
    if (toUpload.length) handleUpload()
    if (toDownload.length) handleDownload()
  }, [toDownload, toUpload, handleUpload, handleDownload])

  useIpc('workspaces.get', (data: Workspace[]) => {
    setIsSyncing(true)
    setWorkspaces(data)
    getNewData()
  })

  const providerValue = useMemo(
    () => ({
      isSyncing,
      progress,
    }),
    [isSyncing, progress]
  )

  return (
    <CloudSyncContext.Provider value={providerValue}>
      {children}
    </CloudSyncContext.Provider>
  )
}

export default { CloudSyncProvider, CloudSyncContext, useCloudSync }
