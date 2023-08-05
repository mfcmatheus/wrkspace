import React, { ReactNode } from 'react'

interface WorkspaceListItemLastOpenedProps {
  children: ReactNode
}

function WorkspaceListItemLastOpened(props: WorkspaceListItemLastOpenedProps) {
  const { children } = props

  return (
    <p className="mx-auto text-[#757575] text-[10px] uppercase font-thin">
      {children}
    </p>
  )
}

export default WorkspaceListItemLastOpened
