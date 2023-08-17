import React, { useState } from 'react'

import Workspace from 'renderer/@types/Workspace'
import SidebarItem from 'renderer/@types/SidebarItem'
import ModalEditWorkspaceSidebarItem from 'renderer/components/ModalEditWorkspaceSidebarItem'
import Lucide from 'renderer/base-components/lucide'
import { ModalEditWorkspacePages } from 'renderer/@enums/ModalEditWorkspacePages'
import ButtonMain from 'renderer/base-components/ButtonMain'
import ModalEditWorkspaceSidebar from './ModalEditWorkspaceSidebar'
import ModalEditWorkspaceGeneralSettings from './ModalEditWorkspaceGeneralSettings'

interface ModalEditWorkspaceProps {
  workspace: Workspace
  onClose?: () => void
  onSave?: (workspace: Workspace) => void
}

const defaultProps = {
  onClose: () => {},
  onSave: () => {},
}

function ModalEditWorkspace(props: ModalEditWorkspaceProps) {
  const { workspace, onClose, onSave } = props
  const [currentPage, setCurrentPage] = useState<ModalEditWorkspacePages>(
    ModalEditWorkspacePages.General
  )

  const isGeneralPage = currentPage === ModalEditWorkspacePages.General
  const sidebarItems: SidebarItem[] = [
    {
      icon: 'SlidersHorizontal',
      label: 'Settings',
      page: ModalEditWorkspacePages.General,
    },
  ]

  const onClickClose = () => onClose && onClose()
  const onClickSave = () => onSave && onSave(workspace)

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
              current={isGeneralPage}
              onClick={(page) => setCurrentPage(page)}
            >
              {item.label}
            </ModalEditWorkspaceSidebarItem>
          ))}
        </ModalEditWorkspaceSidebar>
        <div className="flex flex-col flex-1">
          <div className="flex p-3">
            <p className="text-white font-thin">Edit workspace</p>
            <button
              type="button"
              className="text-white ml-auto"
              onClick={onClickClose}
            >
              <Lucide icon="X" />
            </button>
          </div>
          <div className="flex-1">
            {isGeneralPage && (
              <ModalEditWorkspaceGeneralSettings workspace={workspace} />
            )}
          </div>
          <div className="flex p-3">
            <ButtonMain primary className="ml-auto" onClick={onClickSave}>
              Save
            </ButtonMain>
          </div>
        </div>
      </div>
    </div>
  )
}

ModalEditWorkspace.defaultProps = defaultProps

export default ModalEditWorkspace
