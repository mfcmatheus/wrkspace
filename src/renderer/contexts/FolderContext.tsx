import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Folder from 'renderer/@types/Folder'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

export interface props {
  children: React.ReactNode
}

export interface IFolderContext {
  folders: Folder[]
}

export const FolderContext = createContext<IFolderContext>({} as IFolderContext)

export const useFolder = () => {
  const context = useContext<IFolderContext>(FolderContext)

  if (!context) {
    throw new Error('useFolder must be used within a Folder provider')
  }

  return context
}

export function FolderProvider(props: props) {
  const { children } = props

  const [folders, setFolders] = useState<Folder[]>([])

  const providerValue = useMemo(
    () => ({
      folders,
    }),
    [folders]
  )

  useEffect(() => ipcRenderer.sendMessage('folders.get'), [])

  useIpc('folders.reload', (data: Folder[]) => {
    const filtered = data.filter((folder) => !folder.deleted_at)
    setFolders(filtered)
  })

  useIpc('folders.get', (data: Folder[]) => {
    const filtered = data.filter((folder) => !folder.deleted_at)
    setFolders(filtered)
  })

  return (
    <FolderContext.Provider value={providerValue}>
      {children}
    </FolderContext.Provider>
  )
}

export default { FolderProvider, FolderContext, useFolder }
