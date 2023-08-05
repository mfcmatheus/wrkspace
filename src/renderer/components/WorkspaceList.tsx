import React, { ReactNode } from 'react'

interface WorkspaceListProps {
  children: ReactNode
}

function WorkspaceList(props: WorkspaceListProps) {
  const { children } = props

  return <div className="grid grid-cols-5 gap-3">{children}</div>
}

export default WorkspaceList
