import React, { useState } from 'react'
import { Formik, Form } from 'formik'

import Workspace from 'renderer/@types/Workspace'
import SidebarItem from 'renderer/@types/SidebarItem'
import ModalEditWorkspaceSidebarItem from 'renderer/components/ModalEditWorkspaceSidebarItem'
import ModalEditWorkspaceSidebar from 'renderer/components/ModalEditWorkspaceSidebar'
import ModalEditWorkspaceGeneralSettings from 'renderer/components/ModalEditWorkspaceGeneralSettings'
import ModalEditWorkspaceTerminal from 'renderer/components/ModalEditWorkspaceTerminal'
import ModalEditWorkspaceDocker from 'renderer/components/ModalEditWorkspaceDocker'
import Lucide from 'renderer/base-components/lucide'
import ButtonMain from 'renderer/base-components/ButtonMain'
import { ModalEditWorkspacePages } from 'renderer/@enums/ModalEditWorkspacePages'
import WorkspaceFormSchema from 'renderer/@schemas/WorkspaceFormSchema'
import Setting from 'renderer/@types/Setting'

interface ModalEditWorkspaceProps {
  workspace: Workspace
  settings: Setting
  onClose?: () => void
  onSave?: (workspace: Workspace) => void
  onDelete?: (workspace: Workspace) => void
  onCreate?: (workspace: Workspace) => void
}

const defaultProps = {
  onClose: () => {},
  onSave: () => {},
  onDelete: () => {},
  onCreate: () => {},
}

function ModalEditWorkspace(props: ModalEditWorkspaceProps) {
  const { workspace, settings, onClose, onSave, onDelete, onCreate } = props
  const [currentPage, setCurrentPage] = useState<ModalEditWorkspacePages>(
    ModalEditWorkspacePages.General
  )

  const isEditing = !!workspace.id

  const isGeneralPage = currentPage === ModalEditWorkspacePages.General
  const isTerminalPage = currentPage === ModalEditWorkspacePages.Terminal
  const isDockerPage = currentPage === ModalEditWorkspacePages.Docker

  const sidebarItems: SidebarItem[] = [
    {
      icon: 'Settings',
      label: 'General',
      page: ModalEditWorkspacePages.General,
    },
    {
      icon: 'Terminal',
      label: 'Terminals',
      page: ModalEditWorkspacePages.Terminal,
    },
    {
      icon: 'Container',
      label: 'Docker',
      page: ModalEditWorkspacePages.Docker,
    },
  ]

  const onClickClose = () => onClose && onClose()
  const onSubmit = (data: Workspace) => {
    data.folder = settings.currentFolder
    return isEditing ? onSave && onSave(data) : onCreate && onCreate(data)
  }
  const onClickDelete = () => onDelete && onDelete(workspace)

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-1 inset-0 opacity-[60%] bg-[#000000]"
        onClick={onClickClose}
      />
      <div className="flex relative z-2 m-auto bg-[#202020] rounded-lg h-[80vh] w-[60vw] shadow">
        <ModalEditWorkspaceSidebar>
          {sidebarItems.map((item) => (
            <ModalEditWorkspaceSidebarItem
              {...item}
              key={item.label}
              current={currentPage === item.page}
              onClick={(page) => setCurrentPage(page)}
            >
              {item.label}
            </ModalEditWorkspaceSidebarItem>
          ))}
        </ModalEditWorkspaceSidebar>
        <div className="flex flex-col flex-1">
          <div className="flex p-3">
            {isEditing ? (
              <p className="text-white font-thin">Edit workspace</p>
            ) : (
              <p className="text-white font-thin">Create workspace</p>
            )}
            <button
              type="button"
              className="text-white ml-auto"
              onClick={onClickClose}
            >
              <Lucide icon="X" />
            </button>
          </div>
          <Formik
            initialValues={workspace}
            validationSchema={WorkspaceFormSchema}
            onSubmit={onSubmit}
          >
            <Form className="flex flex-col flex-grow basis-0">
              {isGeneralPage && <ModalEditWorkspaceGeneralSettings />}
              {isTerminalPage && (
                <ModalEditWorkspaceTerminal workspace={workspace} />
              )}
              {isDockerPage && <ModalEditWorkspaceDocker />}
              <div className="flex p-3">
                {isEditing && (
                  <ButtonMain danger bordered onClick={onClickDelete}>
                    Delete
                  </ButtonMain>
                )}
                <ButtonMain type="submit" primary className="ml-auto">
                  Save
                </ButtonMain>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  )
}

ModalEditWorkspace.defaultProps = defaultProps

export default ModalEditWorkspace
