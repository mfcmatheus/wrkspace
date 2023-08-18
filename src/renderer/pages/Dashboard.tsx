import React, { useEffect, useState } from 'react'

import TopBar from 'renderer/components/TopBar'
import WorkspaceList from 'renderer/components/WorkspaceList'
import ModalEditWorkspace from 'renderer/components/ModalEditWorkspace'
import WorkspaceListItem from 'renderer/components/WorkspaceListItem'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  )

  const onClickWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setIsModalEditOpen(true)
  }

  const onSave = (workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.update', workspace)
    setIsModalEditOpen(false)
  }

  useEffect(() => {
    ipcRenderer.sendMessage('workspaces.get')
  })

  useIpc('workspaces.get', (data: Workspace[]) => {
    setWorkspaces(data)
  })

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
          onSave={onSave}
        />
      )}
    </>
  )
}

export default Dashboard
