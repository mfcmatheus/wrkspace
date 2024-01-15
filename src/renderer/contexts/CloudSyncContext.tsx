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
import WorkspaceMutation from 'renderer/graphql/mutations/WorkspaceMutation'
import Folder from 'renderer/@types/Folder'
import FoldersIdsQuery from 'renderer/graphql/queries/FoldersIdsQuery'
import FolderMutation from 'renderer/graphql/mutations/FolderMutation'
import FolderQuery from 'renderer/graphql/queries/FolderQuery'
import WorkspaceDeleteMutation from 'renderer/graphql/mutations/WorkspaceDeleteMutation'
import fakeId from 'renderer/helpers/fakeId'
import FolderDeleteMutation from 'renderer/graphql/mutations/FolderDeleteMutation'
import { useUser } from './UserContext'
import { useToast } from './ToastContext'

export interface props {
  children: React.ReactNode
}

export interface ICloudSyncContext {
  isSyncing: boolean
  progress: number
  workspaces: Workspace[]
  lastSync: moment.Moment | null
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
  const { hasCloudSync, refetchUser } = useUser()
  const { showError } = useToast()

  const apolloClient = useMemo(() => client('/user'), [])

  const [getWorkspacesIds] = useLazyQuery(WorkspacesIdsQuery, {
    client: apolloClient,
  })

  const [getFoldersIds] = useLazyQuery(FoldersIdsQuery, {
    client: apolloClient,
  })

  const [getFolder] = useLazyQuery(FolderQuery, {
    client: apolloClient,
  })

  const [saveWorkspace] = useMutation(WorkspaceMutation, {
    client: apolloClient,
  })

  const [deleteWorkspace] = useMutation(WorkspaceDeleteMutation, {
    client: apolloClient,
  })

  const [saveFolder] = useMutation(FolderMutation, {
    client: apolloClient,
  })

  const [deleteFolder] = useMutation(FolderDeleteMutation, {
    client: apolloClient,
  })

  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null)
  const [folders, setFolders] = useState<Folder[] | null>(null)
  const [newData, setNewData] = useState<object[] | null>(null)
  const [newFoldersData, setNewFoldersData] = useState<object[] | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<moment.Moment | null>(null)

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
        ? moment(item.updated_at).isAfter(relative.updated_at ?? moment()) &&
            !relative.deleted_at
        : true
    })
  }, [workspaces, newData])
  const toUpload = useMemo(() => {
    if (!workspaces || !newData) return []

    return (workspaces ?? [])
      .filter((item) => !item.deleted_at)
      .filter((item) => !!item.repo)
      .filter((item) => {
        const relative = (newData ?? []).find(
          (workspace) => workspace.id === item.id
        )

        return relative
          ? moment(item.updated_at ?? moment()).isAfter(relative.updated_at)
          : true
      })
  }, [workspaces, newData])
  const toDelete = useMemo(() => {
    if (!workspaces) return []

    return workspaces.filter((item) => !!item.deleted_at)
  }, [workspaces])

  const foldersToDownload = useMemo(() => {
    if (!newFoldersData || !folders) return []

    return (newFoldersData ?? []).filter((item) => {
      const relative = (folders ?? []).find((folder) => folder.id === item.id)

      return relative
        ? moment(item.updated_at).isAfter(relative.updated_at ?? moment()) &&
            !relative.deleted_at
        : true
    })
  }, [folders, newFoldersData])

  const foldersToUpload = useMemo(() => {
    if (!folders || !newFoldersData) return []

    return (folders ?? [])
      .filter((item) => !item.deleted_at)
      .filter((item) => {
        const relative = (newFoldersData ?? []).find(
          (folder) => folder.id === item.id
        )

        return relative
          ? moment(item.updated_at ?? moment()).isAfter(relative.updated_at)
          : true
      })
  }, [folders, newFoldersData])

  const foldersToDelete = useMemo(() => {
    if (!folders) return []

    return folders.filter((item) => !!item.deleted_at)
  }, [folders])

  const getNewData = useCallback(async () => {
    const {
      data: { Workspaces: data },
    } = await getWorkspacesIds()

    setNewData(data)
  }, [getWorkspacesIds])

  const getNewFoldersData = useCallback(async () => {
    const {
      data: { Folders: data },
    } = await getFoldersIds()

    setNewFoldersData(data)
  }, [getFoldersIds])

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

  const normalizeFolder = useCallback((folder: Folder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, updated_at, ...rest } = folder

    return {
      ...rest,
      id: `${rest.id}`,
    } as Folder
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
        ipcRenderer.sendMessage('workspaces.delete', {
          ...workspace,
          deleted: true,
        })
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

  const handleDelete = useCallback(async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const workspace of toDelete) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await deleteWorkspace({
          variables: { id: workspace.id },
        })

        // Update current workspace id
        ipcRenderer.sendMessage('workspaces.delete', {
          ...workspace,
          deleted: true,
        })
      } catch (error) {
        console.error(error)
        showError('Error while deleting workspaces')
      }
    }
  }, [toDelete, showError, deleteWorkspace])

  const handleFolderDownload = useCallback(async () => {
    const progressSlice = foldersToDownload.length / 100

    // eslint-disable-next-line no-restricted-syntax
    for (const folder of foldersToDownload) {
      try {
        const {
          data: { Folder: newW },
          // eslint-disable-next-line no-await-in-loop
        } = await getFolder({
          variables: { id: folder.id },
        })

        // Update current workspace id
        ipcRenderer.sendMessage('folders.create', newW)

        setDownloadProgress((prev) => prev + progressSlice)
      } catch (error) {
        console.error(error)
        showError('Error while downloading folders')
      }
    }
  }, [foldersToDownload, getFolder, showError])

  const handleFolderUpload = useCallback(async () => {
    const progressSlice = foldersToUpload.length / 100

    // eslint-disable-next-line no-restricted-syntax
    for (const folder of foldersToUpload) {
      try {
        const {
          data: { Folder: newW },
          // eslint-disable-next-line no-await-in-loop
        } = await saveFolder({
          variables: { folder: normalizeFolder(folder) },
        })

        // Update current workspace id
        ipcRenderer.sendMessage('folders.delete', { ...folder, deleted: true })
        ipcRenderer.sendMessage('folders.create', {
          ...folder,
          ...newW,
        })

        setUploadProgress((prev) => prev + progressSlice)
      } catch (error) {
        console.error(error)
        showError('Error while uploading folders')
      }
    }
  }, [foldersToUpload, saveFolder, showError, normalizeFolder])

  const handleFolderDelete = useCallback(async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const folder of foldersToDelete) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await deleteFolder({
          variables: { id: folder.id },
        })

        // Update current workspace id
        ipcRenderer.sendMessage('folders.delete', { ...folder, deleted: true })
      } catch (error) {
        console.error(error)
        showError('Error while deleting folders')
      }
    }
  }, [foldersToDelete, showError, deleteFolder])

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
    ipcRenderer.sendMessage('folders.get')
    ipcRenderer.sendMessage('workspaces.get')
  }, [hasCloudSync])

  useEffect(() => {
    if (toUpload.length) handleUpload()

    setLastSync(moment())
  }, [toUpload, handleUpload])

  useEffect(() => {
    if (toDelete.length) handleDelete()

    setLastSync(moment())
  }, [toDelete, handleDelete])

  useEffect(() => {
    if (foldersToUpload.length) handleFolderUpload()

    setLastSync(moment())
  }, [foldersToUpload, handleFolderUpload])

  useEffect(() => {
    if (foldersToDownload.length) handleFolderDownload()

    setLastSync(moment())
  }, [foldersToDownload, handleFolderDownload])

  useEffect(() => {
    if (foldersToDelete.length) handleFolderDelete()

    setLastSync(moment())
  }, [foldersToDelete, handleFolderDelete])

  useIpc('workspaces.get', async (data: Workspace[]) => {
    if (!hasCloudSync) return
    setIsSyncing(true)

    setWorkspaces(data)
    await getNewData()

    setIsSyncing(false)
  })

  useIpc('cloud.reload', async ({ w, f }: { w: Workspace[]; f: Folder[] }) => {
    /* await refetchUser()
    setWorkspaces(w)
    console.log(w, toUpload)

    if (!hasCloudSync) return

    setIsSyncing(true)

    setWorkspaces(w)
    setFolders(f)
    await getNewFoldersData()
    await getNewData()

    setIsSyncing(false) */
  })

  useIpc('folders.get', async (data: Folder[]) => {
    if (!hasCloudSync) return
    setIsSyncing(true)

    setFolders(data)
    await getNewFoldersData()

    setIsSyncing(false)
  })

  const providerValue = useMemo(
    () => ({
      isSyncing,
      progress,
      workspaces: toDownload as Workspace[],
      setLoading,
      lastSync,
    }),
    [isSyncing, progress, toDownload, setLoading, lastSync]
  )

  return (
    <CloudSyncContext.Provider value={providerValue}>
      {children}
    </CloudSyncContext.Provider>
  )
}

export default { CloudSyncProvider, CloudSyncContext, useCloudSync }
