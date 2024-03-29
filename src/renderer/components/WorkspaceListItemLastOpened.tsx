import classNames from 'classnames'
import React, { ReactNode, useMemo } from 'react'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import { useSetting } from 'renderer/contexts/SettingContext'

interface WorkspaceListItemLastOpenedProps {
  children: ReactNode
}

function WorkspaceListItemLastOpened(props: WorkspaceListItemLastOpenedProps) {
  const { children } = props
  const { currentView } = useSetting()

  const classes = useMemo(
    () =>
      classNames({
        'text-[#757575] text-[10px] uppercase font-thin': true,
        'mx-auto h-[15px]': currentView === DashboardViews.GRID,
        'order-4 ml-auto whitespace-nowrap':
          currentView === DashboardViews.LIST,
      }),
    [currentView]
  )

  return <p className={classes}>{children}</p>
}

export default WorkspaceListItemLastOpened
