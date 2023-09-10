import React, { ReactNode } from 'react'

interface WorkspaceListProps {
  children: ReactNode
}

function WorkspaceList(props: WorkspaceListProps) {
  const { children } = props

  return (
    <div className="grid grid-cols-5 items-start gap-3 flex-grow basis-0 overflow-auto">
      {children}
    </div>
  )
}

export default WorkspaceList
