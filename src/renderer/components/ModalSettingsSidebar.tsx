import React, { ReactNode } from 'react'

interface ModalSettingsSidebarProps {
  children: ReactNode
}

function ModalSettingsSidebar(props: ModalSettingsSidebarProps) {
  const { children } = props

  return (
    <ul className="flex flex-col gap-y-2 justify-center w-3/12 border-r border-[#353535]">
      {children}
    </ul>
  )
}

export default ModalSettingsSidebar
