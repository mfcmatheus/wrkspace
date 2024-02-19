import React, { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Process from 'renderer/@types/Process'
import Lucide from 'renderer/base-components/lucide'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import LogMainConsole from './LogMainConsole'

interface LogMainConsoleProps {
  processes: Process[]
  className?: string
}

function LogMainWindow(props: LogMainConsoleProps) {
  const { className, processes } = props

  const [selectedProcess, setSelectedProcess] = useState<Process>(processes[0])

  const orderedProcesses = useMemo(() => {
    return processes.sort((a, b) => a.running - b.running)
  }, [processes])

  const isSelectedProcess = useCallback(
    (process: Process) => {
      return selectedProcess?.pid === process.pid
    },
    [selectedProcess]
  )

  const onCloseProcess = useCallback((process: Process) => {
    ipcRenderer.sendMessage('process.close', process)
  }, [])

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
        {orderedProcesses.map((process) => (
          <li
            key={process.pid}
            className={classNames({
              'flex items-center px-3 border-b border-[#353535] w-[200px] overflow-hidden relative':
                true,
              'opacity-50': !process.running,
            })}
          >
            <span className="flex w-3 justify-center">
              {process.running ? (
                <LoadingIcon icon="oval" color="#f0f0f0" className="w-full" />
              ) : (
                <Lucide icon="Check" size={12} color="#f0f0f0" />
              )}
            </span>
            <button
              type="button"
              className="text-left flex-1 text-sm font-thin px-3 py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
              onClick={() => setSelectedProcess(process)}
            >
              {process.title}
            </button>
            <button type="button" onClick={() => onCloseProcess(process)}>
              <Lucide icon="X" size={16} color="#6f6f6f" />
            </button>
            {isSelectedProcess(process) && (
              <span className="w-[8px] h-[8px] rounded-full bg-[#353535] absolute right-[-3px]" />
            )}
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
