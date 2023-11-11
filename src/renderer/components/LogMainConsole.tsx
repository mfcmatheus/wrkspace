import React, { useEffect, useRef } from 'react'
import LogWindow from 'renderer/@types/LogWindow'

interface LogMainConsoleProps {
  window: LogWindow
}

function LogMainConsole(props: LogMainConsoleProps) {
  const { window } = props

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [window.data])

  return (
    <div className="flex flex-col h-[30vh] overflow-y-auto p-2">
      <ul className="text-xs text-[#d2d2d2] font-thin">
        {window.data.map((data, index) => (
          <li key={index}>{data}</li>
        ))}
      </ul>
      <div ref={bottomRef} />
    </div>
  )
}

export default LogMainConsole
