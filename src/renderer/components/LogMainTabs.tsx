import React from 'react'

interface LogMainTabsProps {
  children: React.ReactNode
}

function LogMainTabs(props: LogMainTabsProps) {
  const { children } = props

  return (
    <div className="flex overflow-x-auto border-y border-[#353535]">
      {children}
    </div>
  )
}

export default LogMainTabs
