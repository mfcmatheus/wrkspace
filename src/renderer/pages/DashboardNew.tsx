import React from 'react'
import Lucide from 'renderer/base-components/lucide'
import ActionsMain from 'renderer/components/ActionsMain'
import FoldersMain from 'renderer/components/FoldersMain'
import MenuMain from 'renderer/components/MenuMain'
import TeamSelector from 'renderer/components/TeamSelector'
import TopBar from 'renderer/components/TopBar'
import WorkspaceList from 'renderer/components/WorkspaceList'
import MainLayout from 'renderer/layouts/MainLayout'

export default function DashboardNew() {
  return (
    <MainLayout>
      <div className="flex flex-col p-3 h-full w-[275px] bg-background rounded-l-md border border-border/75 overflow-hidden">
        <div className="flex flex-col gap-y-6 flex-grow basis-full overflow-y-auto">
          <div className="flex items-center w-full gap-x-2">
            <TeamSelector />
            <button type="button" className="ml-auto">
              <Lucide icon="Search" size={18} strokeWidth={1} />
            </button>
          </div>
          <MenuMain />
          <FoldersMain />
          <ActionsMain />
        </div>
      </div>
      <div className="bg-background flex-1 rounded-r-md border border-l-0 border-border/75 overflow-hidden h-full">
        <TopBar />
        <WorkspaceList />
      </div>
    </MainLayout>
  )
}
