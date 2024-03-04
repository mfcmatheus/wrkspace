import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

import { DashboardViews } from 'renderer/@enums/DashboardViews'
import Lucide from 'renderer/base-components/lucide'
import { useSetting } from 'renderer/contexts/SettingContext'
import { ipcRenderer } from 'renderer/hooks/useIpc'

interface DashboardViewIndicatorProps {
  className?: string
}

export default function DashboardViewIndicator(
  props: DashboardViewIndicatorProps
) {
  const { className } = props

  const settings = useSetting()

  const [currentView, setCurrentView] = useState<DashboardViews>(
    settings.currentView ?? DashboardViews.GRID
  )

  const classes = useMemo(
    () =>
      classNames({
        '': true,
        [className!]: className,
      }),
    [className]
  )

  const onClick = useCallback(() => {
    setCurrentView((prevView) =>
      prevView === DashboardViews.GRID
        ? DashboardViews.LIST
        : DashboardViews.GRID
    )
  }, [setCurrentView])

  useEffect(() => {
    ipcRenderer.sendMessage('settings.update', { ...settings, currentView })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView])

  return (
    <button type="button" className={classes} onClick={onClick}>
      {currentView === DashboardViews.GRID ? (
        <Lucide icon="LayoutGrid" size="24" color="#6f6f6f" strokeWidth={1} />
      ) : (
        <Lucide icon="LayoutList" size="24" color="#fff" strokeWidth={1} />
      )}
    </button>
  )
}
