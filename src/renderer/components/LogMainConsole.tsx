import React, { useEffect, useMemo, useRef, useState } from 'react'
import { XTerm } from 'xterm-for-react'
import { FitAddon } from 'xterm-addon-fit'

import classNames from 'classnames'
import { useIpc } from 'renderer/hooks/useIpc'
import Process from 'renderer/@types/Process'

interface LogMainConsoleProps {
  process: Process
}

const fitAddon = new FitAddon()

export default function LogMainConsole(props: LogMainConsoleProps) {
  const { process } = props

  const xtermRef = useRef(null)

  useEffect(() => {
    if (!process) return

    fitAddon.fit()

    for (const line of process.data) {
      xtermRef.current?.terminal?.write(line)
    }
  }, [process])

  useIpc('terminal.incData', (data: Process) => {
    if (!xtermRef.current?.terminal || data.pid !== process.pid) return
    xtermRef.current.terminal.write(data.data)
  })

  return (
    <div className="p-2 max-h-full overflow-auto">
      <XTerm
        options={{
          fontSize: 12,
          rows: 14,
          theme: { background: '#202020' },
          scrollOnUserInput: true,
        }}
        addons={[fitAddon]}
        className="h-full w-full"
        ref={xtermRef}
      />
    </div>
  )
}
