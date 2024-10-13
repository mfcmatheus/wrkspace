import React from 'react'
import Folder from 'renderer/@types/Folder'
import Workspace from 'renderer/@types/Workspace'
import Logo from 'renderer/base-components/Logo'
import Lucide from 'renderer/base-components/lucide'

interface Props {
  workspace: Workspace
  folder?: Folder
  onBack: () => void
}

export default function DashboardBreadcrumbs(props: Props) {
  const { workspace, folder, onBack } = props

  return (
    <div className="flex items-center">
      {workspace && (
        <button
          type="button"
          className="flex items-center gap-x-2"
          onClick={onBack}
        >
          <Lucide icon="ChevronLeft" size={22} strokeWidth={1} />
        </button>
      )}
      <button type="button" className="h-[40px] w-[40px]" onClick={onBack}>
        <Logo color="white" />
      </button>
      <div className="flex items-center gap-x-3 ml-1">
        <span className="text-secondary">/</span>
        <button type="button" onClick={onBack}>
          <h2 className="font-thin text-white text-lg overflow-hidden whitespace-nowrap text-ellipsis">
            {folder?.name ?? 'Dashboard'}
          </h2>
        </button>
        {workspace && (
          <>
            <span className="text-secondary">/</span>
            <h2 className="font-thin text-white text-lg overflow-hidden whitespace-nowrap text-ellipsis">
              {workspace.name ?? 'New workspace'}
            </h2>
          </>
        )}
      </div>
    </div>
  )
}
