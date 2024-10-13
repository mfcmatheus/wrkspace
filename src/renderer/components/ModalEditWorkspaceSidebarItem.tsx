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
        'flex items-center py-2 px-3 font-thin text-white/75 hover:bg-border rounded transition ease-in-out duration-200':
          true,
        ' bg-border font-normal !text-white': current,
        'cursor-pointer': !current,
      }),
    [current]
  )

  return (
    <li className={classes} onClick={() => onClick(page)} aria-hidden="true">
      {children}
    </li>
  )
}

ModalEditWorkspaceSidebarItem.defaultProps = defaultProps

export default ModalEditWorkspaceSidebarItem
