import React, { useEffect, useMemo, useRef, useState } from 'react'
import { XTerm } from 'xterm-for-react'
import classNames from 'classnames'
import LogWindow from 'renderer/@types/LogWindow'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Process from 'renderer/@types/Process'
import Lucide from 'renderer/base-components/lucide'
import LogMainConsole from './LogMainConsole'

interface LogMainConsoleProps {
  processes: Process[]
  className?: string
}

function LogMainWindow(props: LogMainConsoleProps) {
  const { className, processes } = props

  const [selectedProcess, setSelectedProcess] = useState<Process>(processes[0])

  useIpc('terminal.incData', (data: Process) => {
    if (!processes.find((p) => p.pid === data.pid)) {
      setSelectedProcess(data)
    }
  })

  return (
    <div
      className={classNames({
        'flex h-[30vh] overflow-y-auto': true,
        [className!]: !!className,
      })}
    >
      <ul className="border-r border-[#353535]">
        {processes.map((process) => (
          <li
            key={process.pid}
            className="flex items-center pr-3 border-b border-[#353535] w-[160px]"
          >
            <button
              type="button"
              className="text-left flex-1 text-sm font-thin px-3 py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
              onClick={() => setSelectedProcess(process)}
            >
              {process.title}
            </button>
            <button type="button" onClick={() => onClose?.()}>
              <Lucide icon="X" size={16} color="#6f6f6f" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex-1">
        {selectedProcess && <LogMainConsole process={selectedProcess} />}
      </div>
    </div>
  )
}

export default LogMainWindow
