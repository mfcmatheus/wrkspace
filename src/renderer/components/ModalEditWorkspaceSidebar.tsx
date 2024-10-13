import React, { ReactNode } from 'react'

interface ModalEditWorkspaceSidebarProps {
  children: ReactNode
}

function ModalEditWorkspaceSidebar(props: ModalEditWorkspaceSidebarProps) {
  const { children } = props

  return <ul className="flex flex-col gap-y-2 w-3/12">{children}</ul>
}

export default ModalEditWorkspaceSidebar
