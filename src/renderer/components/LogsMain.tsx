import React, { useCallback, useEffect, useState } from 'react'

import LogWindow from 'renderer/@types/LogWindow'
import LogMainTabs from 'renderer/components/LogMainTabs'
import LogMainTabsItem from 'renderer/components/LogMainTabsItem'
import LogMainWindow from 'renderer/components/LogMainWindow'
import Process from 'renderer/@types/Process'
import fakeId from 'renderer/helpers/fakeId'
import { useProcess } from 'renderer/contexts/ProcessContext'

function LogsMain() {
  const { processes, closeProcess } = useProcess()

  const [currentWindow, setCurrentWindow] = useState<LogWindow>()
  const [windows, setWindows] = useState<LogWindow[]>([])

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

  const handleClear = useCallback(
    (window: LogWindow) => {
      const toClose = processesByWindow(window) as Process[]
      // eslint-disable-next-line
      for (const process of toClose) {
        closeProcess(process)
      }

      const windowIndex = windows.findIndex(
        (t) => t.workspace.id === window.workspace.id
      )

      setCurrentWindow(windowIndex > 0 ? windows[windowIndex - 1] : undefined)
    },
    [processesByWindow, windows, setCurrentWindow, closeProcess]
  )

  const setLastWindow = useCallback(() => {
    const lastWindow = windows[windows.length - 1]

    if (currentWindow?.workspace?.id !== lastWindow?.workspace?.id) {
      setCurrentWindow(lastWindow)
    }
  }, [windows, currentWindow, setCurrentWindow])

  useEffect(() => {
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

    if (Object.values(data).length !== windows.length) {
      setWindows(Object.values(data))
    }
  }, [processes, windows, setWindows])

  useEffect(() => {
    setLastWindow()
    // eslint-disable-next-line
  }, [windows])

  if (!windows.length) return null

  return (
    <div className="flex flex-col -mb-[1px] overflow-hidden max-w-full">
      <LogMainTabs>
        {windows.map((window) => (
          <LogMainTabsItem
            key={window.workspace.id}
            current={isSelectedWindow(window)}
            onSelect={() => handleClickWindow(window)}
            onClose={() => handleClear(window)}
          >
            {window.workspace.name}
          </LogMainTabsItem>
        ))}
      </LogMainTabs>
      {currentWindow && (
        <LogMainWindow
          window={currentWindow}
          processes={processesByWindow(currentWindow)}
        />
      )}
    </div>
  )
}

export default LogsMain
