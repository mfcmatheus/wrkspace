import React, { ReactNode, useMemo } from 'react'
import classNames from 'classnames'

import Lucide from 'renderer/base-components/lucide'
import SidebarItem from 'renderer/@types/SidebarItem'
import { ModalEditWorkspacePages } from 'renderer/@enums/ModalEditWorkspacePages'

interface ModalEditWorkspaceSidebarItemProps extends SidebarItem {
  children: ReactNode
  current?: boolean
  onClick: (page: ModalEditWorkspacePages) => void
}

const defaultProps = {
  current: false,
}

function ModalEditWorkspaceSidebarItem(
  props: ModalEditWorkspaceSidebarItemProps
) {
  const { children, current, icon, onClick, page } = props
  const classes = useMemo(
    () =>
      classNames({
        'flex items-center py-2 px-3 font-thin text-white': true,
        'bg-gradient-to-r from-primary to-secondary font-normal': current,
        'cursor-pointer': !current,
        'border-t border-[#353535]': page === ModalEditWorkspacePages.Browser,
      }),
    [current, page]
  )

  return (
    <li className={classes} onClick={() => onClick(page)} aria-hidden="true">
      <Lucide icon={icon} className="mr-3" /> {children}
    </li>
  )
}

ModalEditWorkspaceSidebarItem.defaultProps = defaultProps

export default ModalEditWorkspaceSidebarItem
