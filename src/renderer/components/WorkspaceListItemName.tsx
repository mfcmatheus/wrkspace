import React, { ReactNode } from 'react'

interface WorkspaceListItemNameProps {
  children: ReactNode
}

function WorkspaceListItemName(props: WorkspaceListItemNameProps) {
  const { children } = props

  return (
    <h3 className="text-white text-medium text-sm uppercase mx-auto my-7">
      {children}
    </h3>
  )
}

export default WorkspaceListItemName
