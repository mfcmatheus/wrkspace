import React, { useCallback, useMemo, useState } from 'react'

import { useIpc } from 'renderer/hooks/useIpc'
import LogWindow from 'renderer/@types/LogWindow'
import LogMainTabs from 'renderer/components/LogMainTabs'
import LogMainTabsItem from 'renderer/components/LogMainTabsItem'
import LogMainWindow from 'renderer/components/LogMainWindow'
import Process from 'renderer/@types/Process'
import fakeId from 'renderer/helpers/fakeId'

function LogsMain() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [currentWindow, setCurrentWindow] = useState<LogWindow>()

  const windows = useMemo(() => {
    const data = processes.reduce(
      (acc, process) => ({
        ...acc,
        [process.workspace.id]: {
          id: fakeId(),
          workspace: process.workspace,
        },
      }),
      {}
    )

    return Object.values(data)
  }, [processes]) as LogWindow[]

  const processesByWindow = useCallback(
    (window: LogWindow) => {
      return processes.filter((p) => p.workspace.id === window.workspace.id)
    },
    [processes]
  )

  const isSelectedWindow = useCallback(
    (window: LogWindow) => {
      return currentWindow?.workspace.id === window.workspace.id
    },
    [currentWindow]
  )

  const handleClickWindow = useCallback(
    (window: LogWindow) => {
      if (isSelectedWindow(window)) {
        return setCurrentWindow(undefined)
      }

      return setCurrentWindow(window)
    },
    [isSelectedWindow, setCurrentWindow]
  )

  /* const handleClear = useCallback(
    (window: LogWindow) => {
      setWindows((prev) => {
        const index = prev.findIndex(
          (w) => w.workspace.id === window.workspace.id
        )
        prev.splice(index, 1)
        return [...prev]
      })
      setCurrentWindow(undefined)
    },
    [setWindows]
  ) */

  useIpc('processes.update', setProcesses)
  useIpc('terminal.incData', (data: Process) => {
    if (data.workspace.id !== currentWindow?.workspace.id) {
      setCurrentWindow(
        windows.find((w) => w.workspace.id === data.workspace.id)
      )
    }
  })

  if (!windows.length) return <></>

  return (
    <div className="flex flex-col -mb-[1px]">
      <LogMainTabs>
        {windows.map((window) => (
          <LogMainTabsItem
            key={window.workspace.id}
            current={isSelectedWindow(window)}
            onSelect={() => handleClickWindow(window)}
            // onClose={() => handleClear(window)}
          >
            {window.workspace.name}
          </LogMainTabsItem>
        ))}
      </LogMainTabs>
      {currentWindow && (
        <LogMainWindow processes={processesByWindow(currentWindow)} />
      )}
    </div>
  )
}

export default LogsMain
