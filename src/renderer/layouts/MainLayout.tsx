import React from 'react'
import FoldersMain from 'renderer/components/FoldersMain'
import MenuMain from 'renderer/components/MenuMain'
import TeamsBar from 'renderer/components/TeamsBar'
import TopBar from 'renderer/components/TopBar'

interface Props {
  children: React.ReactNode
}

export default function MainLayout(props: Props) {
  const { children } = props

  return (
    <div className="flex h-full p-1 overflow-hidden">
      <TeamsBar />
      <div className="flex flex-col p-3 h-full w-[275px] bg-background rounded-l-md border border-border/75 overflow-hidden">
        <div className="flex flex-col gap-y-6 flex-grow basis-full overflow-y-auto">
          <MenuMain />
          <FoldersMain />
        </div>
      </div>
      <div className="bg-background flex-1 rounded-r-md border border-l-0 border-border/75">
        <TopBar />
        {children}
      </div>
    </div>
  )
}
