import React, { useCallback, useMemo, useState } from 'react'
import { Formik, Form } from 'formik'

import moment from 'moment'
import Workspace from 'renderer/@types/Workspace'
import SidebarItem from 'renderer/@types/SidebarItem'
import ModalEditWorkspaceSidebarItem from 'renderer/components/ModalEditWorkspaceSidebarItem'
import ModalEditWorkspaceSidebar from 'renderer/components/ModalEditWorkspaceSidebar'
import ModalEditWorkspaceGeneralSettings from 'renderer/components/ModalEditWorkspaceGeneralSettings'
import ModalEditWorkspaceTerminal from 'renderer/components/ModalEditWorkspaceTerminal'
import ModalEditWorkspaceDocker from 'renderer/components/ModalEditWorkspaceDocker'
import ModalEditWorkspaceBrowser from 'renderer/components/ModalEditWorkspaceBrowser'
import Lucide from 'renderer/base-components/lucide'
import ButtonMain from 'renderer/base-components/ButtonMain'
import { ModalEditWorkspacePages } from 'renderer/@enums/ModalEditWorkspacePages'
import WorkspaceFormSchema from 'renderer/@schemas/WorkspaceFormSchema'
import Setting from 'renderer/@types/Setting'
import { useUser } from 'renderer/contexts/UserContext'
import DeleteButton from './DeleteButton'
import ModalEditWorkspaceInstallation from './ModalEditWorkspaceInstallation'

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

  const { hasCloudSync } = useUser()

  const isEditing = useMemo(() => !!workspace.id, [workspace])
  const isGeneralPage = useMemo(
    () => currentPage === ModalEditWorkspacePages.General,
    [currentPage]
  )
  const isTerminalPage = useMemo(
    () => currentPage === ModalEditWorkspacePages.Terminal,
    [currentPage]
  )
  const isDockerPage = useMemo(
    () => currentPage === ModalEditWorkspacePages.Docker,
    [currentPage]
  )
  const isBrowserPage = useMemo(
    () => currentPage === ModalEditWorkspacePages.Browser,
    [currentPage]
  )
  const isInstallationPage = useMemo(
    () => currentPage === ModalEditWorkspacePages.Cloud,
    [currentPage]
  )

  const sidebarItems: SidebarItem[] = useMemo(
    () =>
      [
        {
          icon: 'Settings2',
          label: 'General',
          page: ModalEditWorkspacePages.General,
        },
        {
          icon: 'Cloud',
          label: 'Installation',
          page: ModalEditWorkspacePages.Cloud,
          condition: hasCloudSync,
        },
        {
          icon: 'Globe',
          label: 'Pages',
          page: ModalEditWorkspacePages.Browser,
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
      ].filter((item) =>
        typeof item.condition !== 'undefined' ? item.condition : true
      ),
    [hasCloudSync]
  )

  const onClickClose = useCallback(() => onClose && onClose(), [onClose])
  const onSubmit = useCallback(
    (data: Workspace) => {
      data.folder = settings.currentFolder
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
      return isEditing ? onSave && onSave(data) : onCreate && onCreate(data)
    },
    [isEditing, onSave, onCreate, settings]
  )
  const onClickDelete = useCallback(
    () => onDelete && onDelete(workspace),
    [onDelete, workspace]
  )

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-[3] inset-0 bg-black/[.6] backdrop-blur-sm"
        onClick={onClickClose}
      />
      <div className="flex relative z-[4] m-auto bg-[#202020] rounded-lg h-[80vh] w-[60vw] shadow">
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
              {isBrowserPage && (
                <ModalEditWorkspaceBrowser workspace={workspace} />
              )}
              {isTerminalPage && (
                <ModalEditWorkspaceTerminal workspace={workspace} />
              )}
              {isDockerPage && <ModalEditWorkspaceDocker />}
              {isInstallationPage && (
                <ModalEditWorkspaceInstallation workspace={workspace} />
              )}
              <div className="flex p-3">
                {isEditing && (
                  <DeleteButton onClick={onClickDelete}>Delete</DeleteButton>
                )}
                <ButtonMain
                  type="submit"
                  sm
                  bordered
                  secondary
                  className="ml-auto"
                >
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
