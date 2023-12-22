import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import moment from 'moment'
import client from 'renderer/graphql/client'
import WorkspacesIdsQuery from 'renderer/graphql/queries/WorkspacesIdsQuery'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Workspace from 'renderer/@types/Workspace'
import WorkspaceQuery from 'renderer/graphql/queries/WorkspaceQuery'
import WorkspaceMutation from 'renderer/graphql/mutations/WorkspaceMutation'
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
  const [getWorkspace] = useLazyQuery(WorkspaceQuery, {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const [saveWorkspace] = useMutation(WorkspaceMutation, {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null)
  const [newData, setNewData] = useState<object[] | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const progress = useMemo(() => {
    return ((newData ? 100 : 0) + downloadProgress + uploadProgress) / 3
  }, [newData, downloadProgress, uploadProgress])

  const toDownload = useMemo(() => {
    if (!newData || !workspaces) return []

    return (newData ?? []).filter((item) => {
      const relative = (workspaces ?? []).find(
        (workspace) => workspace.id === item.id
      )

      return relative
        ? moment(item.updated_at).isAfter(relative.updated_at ?? moment())
        : true
    })
  }, [workspaces, newData])
  const toUpload = useMemo(() => {
    if (!workspaces || !newData) return []

    return (workspaces ?? []).filter((item) => {
      const relative = (newData ?? []).find(
        (workspace) => workspace.id === item.id
      )

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
    const progressSlice = toUpload.length / 100

    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of toUpload) {
      const { created_at, updated_at, path, ...rest } = workspace

      const {
        data: { Workspace: newW },
        // eslint-disable-next-line no-await-in-loop
      } = await saveWorkspace({
        variables: { workspace: { ...rest, id: `${rest.id}` } },
      })

      delete newW.__typename

      // Update current workspace id
      ipcRenderer.sendMessage('workspaces.delete', workspace)
      ipcRenderer.sendMessage('workspaces.create', {
        ...workspace,
        ...newW,
      })

      setUploadProgress((prev) => prev + progressSlice)
    }
  }, [toUpload, saveWorkspace])

  const handleDownload = useCallback(async () => {
    const progressSlice = toDownload.length / 100

    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of toDownload) {
      const {
        data: { Workspace: data },
        // eslint-disable-next-line no-await-in-loop
      } = await getWorkspace({ variables: { id: workspace.id } })

      ipcRenderer.sendMessage('workspaces.create', data)

      setDownloadProgress((prev) => prev + progressSlice)
    }
  }, [toDownload, getWorkspace])

  useEffect(() => {
    if (!hasCloudSync) return
    ipcRenderer.sendMessage('workspaces.get')
  }, [hasCloudSync])

  useEffect(() => {
    console.log('toDownload', toDownload)
    console.log('toUpload', toUpload)

    if (toUpload.length) handleUpload()
    // if (toDownload.length) handleDownload()
  }, [toDownload, toUpload, handleUpload, handleDownload])

  useIpc('workspaces.get', (data: Workspace[]) => {
    if (!hasCloudSync) return
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
