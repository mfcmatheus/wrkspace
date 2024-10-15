import React from 'react'
import MenuMainDashboard from './MenuMainDashboard'
import MenuMainFavorites from './MenuMainFavorites'
import MenuMainMostUsed from './MenuMainMostUsed'
import MenuMainNeverUsed from './MenuMainNeverUsed'
import MenuMainNotInstalled from './MenuMainNotInstalled'
import MenuMainArchived from './MenuMainArchived'

export default function MenuMain() {
  return (
    <ul className="flex flex-col">
      <MenuMainDashboard />
      <MenuMainFavorites />
      <MenuMainMostUsed />
      <MenuMainNeverUsed />
      <MenuMainNotInstalled />
      <MenuMainArchived />
    </ul>
  )
}
