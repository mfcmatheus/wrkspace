import React, { ReactNode } from 'react'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import { useSetting } from 'renderer/contexts/SettingContext'

interface WorkspaceListItemPathProps {
  children: ReactNode
}

export default function WorkspaceListItemPath(
  props: WorkspaceListItemPathProps
) {
  const { children } = props
  const { currentView } = useSetting()

  if (currentView === DashboardViews.GRID) return null

  return (
    <span className="order-2 text-[13px] text-zinc-500 font-thin w-full whitespace-nowrap overflow-hidden text-ellipsis">
      {children}
    </span>
  )
}
