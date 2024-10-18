import React from 'react'

interface LogMainTabsProps {
  children: React.ReactNode
}

function LogMainTabs(props: LogMainTabsProps) {
  const { children } = props

  return (
    <div className="flex overflow-x-auto gap-x-2 max-w-screen border-y border-border p-2">
      {children}
    </div>
  )
}

export default LogMainTabs
