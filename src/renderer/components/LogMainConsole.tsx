import React, { useCallback, useEffect, useRef } from 'react'
import { XTerm } from 'xterm-for-react'
import { FitAddon } from 'xterm-addon-fit'

import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Process from 'renderer/@types/Process'

interface LogMainConsoleProps {
  process: Process
}

const fitAddon = new FitAddon()

export default function LogMainConsole(props: LogMainConsoleProps) {
  const { process } = props

  const xtermRef = useRef(null)

  const onData = useCallback(
    (data: string) => {
      ipcRenderer.sendMessage('terminal.data', { pid: process.pid, data })
    },
    [process]
  )

  useEffect(() => {
    if (!process) return

    fitAddon.fit()
    xtermRef.current?.terminal?.clear()

    for (const line of process.data) {
      xtermRef.current?.terminal?.write(line)
    }
  }, [process])

  useIpc('terminal.incData', (data: Process) => {
    if (!xtermRef.current?.terminal || data?.pid !== process?.pid) return
    xtermRef.current.terminal.write(data.data)
  })

  return (
    <div className="flex max-h-full w-full p-2 overflow-auto bg-background">
      <XTerm
        options={{
          fontSize: 12,
          rows: 14,
          theme: { background: '#09090b' },
          scrollOnUserInput: true,
        }}
        addons={[fitAddon]}
        className="h-full w-full"
        ref={xtermRef}
        onData={onData}
      />
    </div>
  )
}
