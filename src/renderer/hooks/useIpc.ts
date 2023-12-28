import { useEffect, useRef } from 'react'
import { Channels } from 'main/preload'

interface handler {
  (event: any, rest: any): void
}

export const ipcRenderer = window.electron.ipcRenderer as any

export const useIpc = (
  channel: Channels,
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

    ipcRenderer.on(channel, (event, rest) => {
      eventHandler(event, rest)
    })

    return () => {
      ipcRenderer.removeListener(channel, eventHandler)
    }
  }, [channel])
}

export default {
  useIpc,
  ipcRenderer,
}
