import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import Process from 'renderer/@types/Process'
import Workspace from 'renderer/@types/Workspace'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

export interface props {
  children: React.ReactNode
}

export interface IProcessContext {
  processes: Process[]
  getProcessesByWorkspace: (workspace: Workspace) => Process[]
  closeProcess: (process: Process) => void
}

export const ProcessContext = createContext<IProcessContext>(
  {} as IProcessContext
)

export const useProcess = () => {
  const context = useContext<IProcessContext>(ProcessContext)

  if (!context) {
    throw new Error('useProcess must be used within a Process provider')
  }

  return context
}

export function ProcessProvider(props: props) {
  const { children } = props

  const [processes, setProcesses] = useState<Process[]>([])

  const getProcessesByWorkspace = useCallback(
    (workspace: Workspace) => {
      return processes.filter((p) => p.workspace.id === workspace.id) ?? []
    },
    [processes]
  )

  const closeProcess = useCallback((process: Process) => {
    ipcRenderer.sendMessage('process.close', process)
  }, [])

  const providerValue = useMemo(
    () => ({
      processes,
      getProcessesByWorkspace,
      closeProcess,
    }),
    [processes, getProcessesByWorkspace, closeProcess]
  )

  useIpc('processes.update', setProcesses)

  return (
    <ProcessContext.Provider value={providerValue}>
      {children}
    </ProcessContext.Provider>
  )
}

export default { ProcessProvider, ProcessContext, useProcess }
