import React, { ReactNode } from 'react'

interface ModalEditWorkspaceSidebarProps {
  children: ReactNode
}

function ModalEditWorkspaceSidebar(props: ModalEditWorkspaceSidebarProps) {
  const { children } = props

  return (
    <ul className="flex flex-col gap-y-2 justify-center w-3/12 border-r border-[#353535]">
      {children}
    </ul>
  )
}

export default ModalEditWorkspaceSidebar
