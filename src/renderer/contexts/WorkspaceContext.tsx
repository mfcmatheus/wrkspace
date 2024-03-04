import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Workspace from 'renderer/@types/Workspace'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

export interface props {
  children: React.ReactNode
}

export interface IWorkspaceContext {
  workspaces: Workspace[]
}

export const WorkspaceContext = createContext<IWorkspaceContext>(
  {} as IWorkspaceContext
)

export const useWorkspace = () => {
  const context = useContext<IWorkspaceContext>(WorkspaceContext)

  if (!context) {
    throw new Error('useWorkspace must be used within a Workspace provider')
  }

  return context
}

export function WorkspaceProvider(props: props) {
  const { children } = props

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  const providerValue = useMemo(
    () => ({
      workspaces,
    }),
    [workspaces]
  )

  useEffect(() => ipcRenderer.sendMessage('workspaces.get'), [])

  useIpc('workspaces.reload', setWorkspaces)
  useIpc('workspaces.get', setWorkspaces)

  return (
    <WorkspaceContext.Provider value={providerValue}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export default { WorkspaceProvider, WorkspaceContext, useWorkspace }
