import classNames from 'classnames'
import React, { ReactNode, useMemo } from 'react'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import { useSetting } from 'renderer/contexts/SettingContext'

interface WorkspaceListProps {
  children: ReactNode
}

function WorkspaceList(props: WorkspaceListProps) {
  const { children } = props

  const settings = useSetting()

  const gridClasses = useMemo(
    () =>
      classNames({
        'grid justify-start items-start gap-3 w-full': true,
        'grid-cols-5': settings.currentView === DashboardViews.GRID,
        'grid-cols-1': settings.currentView === DashboardViews.LIST,
      }),
    [settings.currentView]
  )

  return (
    <div className="flex flex-grow basis-0 overflow-auto items-start">
      <div className={gridClasses}>{children}</div>
    </div>
  )
}

export default WorkspaceList
