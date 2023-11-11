import React, { useCallback, useState } from 'react'

import { useIpc } from 'renderer/hooks/useIpc'
import LogWindow from 'renderer/@types/LogWindow'
import Workspace from 'renderer/@types/Workspace'
import LogMainTabs from 'renderer/components/LogMainTabs'
import LogMainTabsItem from 'renderer/components/LogMainTabsItem'
import LogMainConsole from 'renderer/components/LogMainConsole'

function LogsMain() {
  const [windows, setWindows] = useState<LogWindow[]>([])
  const [currentWindow, setCurrentWindow] = useState<LogWindow>()

  const exists = useCallback(
    (workspace: Workspace) => {
      return !!windows.find((window) => window.workspace.id === workspace.id)
    },
    [windows]
  )

  const handleData = useCallback(
    (data: any) => {
      if (exists(data.workspace)) {
        if (data.message === false) {
          return setWindows((prev) => {
            const index = prev.findIndex(
              (w) => w.workspace.id === data.workspace.id
            )
            prev[index].data = []
            return [...prev]
          })
        }

        setWindows((prev) => {
          const index = prev.findIndex(
            (w) => w.workspace.id === data.workspace.id
          )
          prev[index].data = [...prev[index].data, ...data.message.split('\n')]
          return [...prev]
        })
      } else {
        const newWindow = {
          workspace: data.workspace,
          data: data.message.split('\n'),
        }
        setWindows((prev) => [...prev, newWindow])
        setCurrentWindow(newWindow)
      }
    },
    [exists, setCurrentWindow, setWindows]
  )

  const isSelectedWindow = useCallback(
    (window: LogWindow) => {
      return currentWindow?.workspace?.id === window.workspace.id
    },
    [currentWindow]
  )

  const handleClick = useCallback(
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
  )

  useIpc('workspaces.open.status', (data: string) => {
    handleData(data)
  })

  if (!windows.length) return <></>

  return (
    <div className="flex flex-col -mb-[1px]">
      <LogMainTabs>
        {windows.map((window) => (
          <LogMainTabsItem
            key={window.workspace.id}
            current={isSelectedWindow(window)}
            onSelect={() => handleClick(window)}
            onClose={() => handleClear(window)}
          >
            {window.workspace.name}
          </LogMainTabsItem>
        ))}
      </LogMainTabs>
      {currentWindow && <LogMainConsole window={currentWindow} />}
    </div>
  )
}

export default LogsMain
