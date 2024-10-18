import { useCallback } from 'react'
import Process from 'renderer/@types/Process'
import { ipcRenderer } from './useIpc'

export default () => {
  const closeProcess = useCallback((process: Process) => {
    ipcRenderer.sendMessage('process.close', process)
  }, [])

  return {
    closeProcess,
  }
}
