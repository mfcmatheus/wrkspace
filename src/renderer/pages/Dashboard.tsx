import React, { useState } from 'react'

import TopBar from 'renderer/components/TopBar'
import WorkspaceList from 'renderer/components/WorkspaceList'
import ModalEditWorkspace from 'renderer/components/ModalEditWorkspace'
import WorkspaceListItem from 'renderer/components/WorkspaceListItem'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'

function Dashboard() {
  const workspaces: Workspace[] = [
    { id: 1, name: 'Workspace 1', path: '' },
    { id: 2, name: 'Workspace 2', path: '' },
  ]

  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  )

  const onClickWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setIsModalEditOpen(true)
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col flex-1 p-4">
        <div className="flex mb-4">
          <h2 className="text-medium text-[#f0f0f0] text-xl">Dashboard</h2>
          <ButtonMain primary className="ml-auto">
            Create
          </ButtonMain>
        </div>
        <WorkspaceList>
          {workspaces.map((workspace) => (
            <WorkspaceListItem
              key={workspace.id}
              workspace={workspace}
              onClick={onClickWorkspace}
            />
          ))}
        </WorkspaceList>
      </div>

      {isModalEditOpen && (
        <ModalEditWorkspace
          workspace={selectedWorkspace as Workspace}
          onClose={() => setIsModalEditOpen(false)}
        />
      )}
    </>
  )
}

export default Dashboard
