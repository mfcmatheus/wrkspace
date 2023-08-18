import { useEffect, useRef } from 'react'

interface handler {
  (event: any, rest: any): void
}

export const ipcRenderer = window.electron.ipcRenderer as any

export const useIpc = (
  channel: string,
  listener: (event: any, args: any) => void
) => {
  const savedHandler = useRef<handler>()

  useEffect(() => {
    savedHandler.current = listener
  }, [listener])

  useEffect(() => {
    if (!ipcRenderer) {
      throw new Error('Use useIpc in the Renderer process only')
    }

    const eventHandler = (event: any, rest: any) =>
      savedHandler.current && savedHandler.current(event, rest)

    ipcRenderer.on(channel, eventHandler)

    return () => {
      // ipcRenderer.removeListener(channel, eventHandler)
    }
  }, [channel])
}

export default {
  useIpc,
  ipcRenderer,
}
