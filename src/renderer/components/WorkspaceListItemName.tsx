import classNames from 'classnames'
import React, { ReactNode, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { DashboardViews } from 'renderer/@enums/DashboardViews'
import SettingCurrentViewSelector from 'renderer/store/selectors/SettingCurrentViewSelector'

interface WorkspaceListItemNameProps {
  children: ReactNode
}

function WorkspaceListItemName(props: WorkspaceListItemNameProps) {
  const { children } = props
  const currentView = useRecoilValue(SettingCurrentViewSelector)

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
