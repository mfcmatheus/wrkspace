import React, { ReactNode } from 'react'

interface WorkspaceListProps {
  children: ReactNode
}

function WorkspaceList(props: WorkspaceListProps) {
  const { children } = props

  return (
    <div className="flex flex-grow basis-0 overflow-auto items-start">
      <div className="grid grid-cols-5 justify-start items-start gap-3 w-full">
        {children}
      </div>
    </div>
  )
}

export default WorkspaceList
