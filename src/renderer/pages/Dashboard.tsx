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
    {} as Workspace
  )

  const onEditWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setIsModalEditOpen(true)
  }

  const onClickCreate = () => {
    setSelectedWorkspace({} as Workspace)
    setIsModalEditOpen(true)
  }

  const onSave = (workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.update', workspace)
    setIsModalEditOpen(false)
  }

  const onDelete = (workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.delete', workspace)
    setIsModalEditOpen(false)
  }

  const onCreate = (workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.create', workspace)
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
        {workspaces?.length ? (
          <>
            <div className="flex mb-4">
              <h2 className="text-medium text-[#f0f0f0] text-xl">Dashboard</h2>
              <ButtonMain primary className="ml-auto" onClick={onClickCreate}>
                Create
              </ButtonMain>
            </div>
            <WorkspaceList>
              {workspaces.map((workspace) => (
                <WorkspaceListItem
                  key={workspace.id}
                  workspace={workspace}
                  onEdit={onEditWorkspace}
                />
              ))}
            </WorkspaceList>
          </>
        ) : (
          <div className="flex flex-col flex-1 items-center h-full justify-center">
            <p className="text-lg text-[#727272] font-thin">
              No workspaces yet, start using Wrkspace creating one
            </p>
            <ButtonMain primary className="mt-6" onClick={onClickCreate}>
              Create workspace
            </ButtonMain>
          </div>
        )}
      </div>

      {isModalEditOpen && (
        <ModalEditWorkspace
          workspace={selectedWorkspace as Workspace}
          onClose={() => setIsModalEditOpen(false)}
          onSave={onSave}
          onDelete={onDelete}
          onCreate={onCreate}
        />
      )}
    </>
  )
}

export default Dashboard
