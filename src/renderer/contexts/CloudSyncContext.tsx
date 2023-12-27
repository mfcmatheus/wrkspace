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
import { useToast } from './ToastContext'

export interface props {
  children: React.ReactNode
}

export interface ICloudSyncContext {
  isSyncing: boolean
  progress: number
  workspaces: Workspace[]
  setLoading: (workspace: Workspace) => void
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
  const { showError } = useToast()

  const apolloClient = useMemo(() => client('/user'), [])

  const [getWorkspacesIds] = useLazyQuery(WorkspacesIdsQuery, {
    client: apolloClient,
  })
  const [getWorkspace] = useLazyQuery(WorkspaceQuery, {
    client: apolloClient,
  })

  const [saveWorkspace] = useMutation(WorkspaceMutation, {
    client: apolloClient,
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

  const normalizeWorkspace = useCallback((workspace: Workspace) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, updated_at, path, ...rest } = workspace

    return {
      ...rest,
      id: `${rest.id}`,
      folder: rest.folder ? { ...rest.folder, id: `${rest.folder.id}` } : null,
      installation: {
        ...rest.installation,
        variables: rest.installation?.variables?.map((t) => ({
          ...t,
          id: `${t.id}`,
        })),
        commands: rest.installation?.commands?.map((t) => ({
          ...t,
          id: `${t.id}`,
        })),
      },
    } as Workspace
  }, [])

  const handleUpload = useCallback(async () => {
    const progressSlice = toUpload.length / 100

    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of toUpload) {
      try {
        const {
          data: { Workspace: newW },
          // eslint-disable-next-line no-await-in-loop
        } = await saveWorkspace({
          variables: { workspace: normalizeWorkspace(workspace) },
        })

        // Update current workspace id
        ipcRenderer.sendMessage('workspaces.delete', workspace)
        ipcRenderer.sendMessage('workspaces.create', {
          ...workspace,
          ...newW,
        })

        setUploadProgress((prev) => prev + progressSlice)
      } catch (error) {
        console.error(error)
        showError('Error while uploading workspaces')
      }
    }
  }, [toUpload, saveWorkspace, showError, normalizeWorkspace])

  const setLoading = useCallback(
    (workspace: Workspace) => {
      const index = (newData ?? []).findIndex(
        (item) => item.id === workspace.id
      )

      const newDataCopy = [...(newData ?? [])]
      newDataCopy[index] = { ...workspace, loading: true }

      setNewData(newDataCopy)
    },
    [newData]
  )

  useEffect(() => {
    if (!hasCloudSync) return
    ipcRenderer.sendMessage('workspaces.get')
  }, [hasCloudSync])

  useEffect(() => {
    if (toUpload.length) handleUpload()
  }, [toUpload, handleUpload])

  useIpc('workspaces.get', async (data: Workspace[]) => {
    if (!hasCloudSync) return
    setIsSyncing(true)

    setWorkspaces(data)
    await getNewData()

    setIsSyncing(false)
  })

  useIpc('workspaces.cloud.reload', async (data: Workspace[]) => {
    setIsSyncing(true)

    setWorkspaces(data)
    await getNewData()

    setIsSyncing(false)
  })

  const providerValue = useMemo(
    () => ({
      isSyncing,
      progress,
      workspaces: toDownload as Workspace[],
      setLoading,
    }),
    [isSyncing, progress, toDownload, setLoading]
  )

  return (
    <CloudSyncContext.Provider value={providerValue}>
      {children}
    </CloudSyncContext.Provider>
  )
}

export default { CloudSyncProvider, CloudSyncContext, useCloudSync }
