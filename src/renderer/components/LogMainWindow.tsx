import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Process from 'renderer/@types/Process'
import Lucide from 'renderer/base-components/lucide'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import LogWindow from 'renderer/@types/LogWindow'
import useProcess from 'renderer/hooks/useProcess'
import LogMainConsole from './LogMainConsole'

interface LogMainConsoleProps {
  processes: Process[]
  window: LogWindow
  className?: string
}

function LogMainWindow(props: LogMainConsoleProps) {
  const { className, processes, window } = props

  const { closeProcess } = useProcess()
  const [selectedProcess, setSelectedProcess] = useState<Process>(processes[0])

  const orderedProcesses = useMemo(() => {
    return processes.sort((a, b) => a.running - b.running)
  }, [processes])

  const isSelectedProcess = useCallback(
    (process: Process) => {
      return selectedProcess?.pid === process?.pid
    },
    [selectedProcess]
  )

  const onCloseProcess = useCallback(
    (process: Process) => {
      closeProcess(process)
    },
    [closeProcess]
  )

  const defineProcess = useCallback(() => {
    if (processes.find((process) => process?.pid === selectedProcess?.pid))
      return
    setSelectedProcess(processes?.[processes.length - 1] ?? null)
  }, [processes, selectedProcess])

  useEffect(() => defineProcess, [processes, defineProcess])

  useEffect(() => {
    if (!window) return
    defineProcess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window])

  return (
    <div
      className={classNames({
        'flex flex-1 overflow-hidden': true,
        [className!]: !!className,
      })}
    >
      <ul className="flex flex-col overflow-y-auto p-2 gap-y-1">
        {orderedProcesses.map((process) => (
          <li
            key={process?.pid}
            className={classNames({
              'flex items-center gap-x-2 w-full py-1 px-2 rounded hover:bg-border':
                true,
              'opacity-50': process.running,
              'bg-border text-white': isSelectedProcess(process),
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
              className="cursor-default font-light text-sm text-left flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
              onClick={() => setSelectedProcess(process)}
            >
              {process.title}
            </button>
            <button
              type="button"
              onClick={() => onCloseProcess(process)}
              className="cursor-default ml-3"
            >
              <Lucide icon="X" size={14} color="#6f6f6f" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-1 overflow-hidden">
        {selectedProcess && <LogMainConsole process={selectedProcess} />}
      </div>
    </div>
  )
}

export default LogMainWindow
