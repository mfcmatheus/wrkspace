import React, { ReactNode, useMemo } from 'react'
import classNames from 'classnames'

import Lucide from 'renderer/base-components/lucide'
import SidebarItem from 'renderer/@types/SidebarItem'
import { ModalEditWorkspacePages } from 'renderer/@enums/ModalEditWorkspacePages'

interface ModalSettingsSidebarItemProps extends SidebarItem {
  children: ReactNode
  current?: boolean
  onClick: (page: ModalEditWorkspacePages) => void
}

const defaultProps = {
  current: false,
}

function ModalSettingsSidebarItem(props: ModalSettingsSidebarItemProps) {
  const { children, current, icon, onClick, page } = props

  const classes = useMemo(
    () =>
      classNames({
        'flex items-center py-2 px-3 font-thin text-white divide-y divide-[#353535]':
          true,
        'bg-indigo-600': current,
        'cursor-pointer': !current,
      }),
    [current]
  )

  return (
    <li className={classes} onClick={() => onClick(page)} aria-hidden="true">
      <Lucide icon={icon} className="mr-3" /> {children}
    </li>
  )
}

ModalSettingsSidebarItem.defaultProps = defaultProps

export default ModalSettingsSidebarItem
