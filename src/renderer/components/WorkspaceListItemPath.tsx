import React, { ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import SettingCurrentViewSelector from 'renderer/store/selectors/SettingCurrentViewSelector'

interface WorkspaceListItemPathProps {
  children: ReactNode
}

export default function WorkspaceListItemPath(
  props: WorkspaceListItemPathProps
) {
  const { children } = props
  const currentView = useRecoilValue(SettingCurrentViewSelector)

  if (currentView === DashboardViews.GRID) return null

  return (
    <span className="order-2 text-[13px] text-zinc-500 font-thin w-full whitespace-nowrap overflow-hidden text-ellipsis">
      {children}
    </span>
  )
}
