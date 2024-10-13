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
import normalize from 'renderer/helpers/normalize'
import DeleteButton from './DeleteButton'
import ModalEditWorkspaceInstallation from './ModalEditWorkspaceInstallation'
import DashboardBreadcrumbs from './DashboardBreadcrumbs'
import TopBar from './TopBar'

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
          condition: !!hasCloudSync,
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
    () => onDelete?.(workspace),
    [onDelete, workspace]
  )

  return (
    <Formik
      initialValues={{ ...workspace, name: normalize(workspace.name) }}
      validationSchema={WorkspaceFormSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <div className="flex flex-col absolute inset-x-0 bottom-0 w-screen h-screen bg-background">
          <TopBar />
          <div className="flex flex-col p-4 h-full">
            <div className="flex items-center pr-1">
              <DashboardBreadcrumbs
                folder={settings?.currentFolder}
                workspace={workspace}
                onBack={onClickClose}
              />
              <ButtonMain
                type="submit"
                sm
                bordered
                secondary
                disabled={!isValid || !dirty}
                className="ml-auto"
              >
                Save workspace
              </ButtonMain>
            </div>
            <div className="flex h-full gap-x-8 pt-10">
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
                <Form className="flex flex-col flex-grow basis-0">
                  {isGeneralPage && (
                    <ModalEditWorkspaceGeneralSettings
                      onDelete={onClickDelete}
                      isEditing={isEditing}
                    />
                  )}
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
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  )
}

ModalEditWorkspace.defaultProps = defaultProps

export default ModalEditWorkspace
