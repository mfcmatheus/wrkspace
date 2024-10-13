import classNames from 'classnames'
import React, { ReactNode, useMemo } from 'react'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import { useSetting } from 'renderer/contexts/SettingContext'

interface WorkspaceListItemNameProps {
  children: ReactNode
}

function WorkspaceListItemName(props: WorkspaceListItemNameProps) {
  const { children } = props
  const { currentView } = useSetting()

  const classes = useMemo(
    () =>
      classNames({
        'text-white text-thin text-sm uppercase': true,
        'mx-auto my-5 min-h-[40px] text-center line-clamp-2':
          currentView === DashboardViews.GRID,
        'w-full whitespace-nowrap overflow-hidden text-ellipsis':
          currentView === DashboardViews.LIST,
      }),
    [currentView]
  )

  return <h3 className={classes}>{children}</h3>
}

export default WorkspaceListItemName
