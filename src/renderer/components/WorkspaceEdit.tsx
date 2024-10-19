import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormikContext } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import classNames from 'classnames'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'
import Workspace from 'renderer/@types/Workspace'
import { ModalEditWorkspacePages } from 'renderer/@enums/ModalEditWorkspacePages'
import Lucide from 'renderer/base-components/lucide'
import SidebarItem from 'renderer/@types/SidebarItem'
import normalize from 'renderer/helpers/normalize'
import ButtonMain from 'renderer/base-components/ButtonMain'
import WorkspaceSelector from './WorkspaceSelector'
import TopBar from './TopBar'
import ModalEditWorkspaceGeneralSettings from './ModalEditWorkspaceGeneralSettings'
import ModalEditWorkspaceBrowser from './ModalEditWorkspaceBrowser'
import ModalEditWorkspaceTerminal from './ModalEditWorkspaceTerminal'
import ModalEditWorkspaceDocker from './ModalEditWorkspaceDocker'
import ModalEditWorkspaceInstallation from './ModalEditWorkspaceInstallation'

export default function WorkspaceEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setValues, isValid, dirty } = useFormikContext()
  const workspace = useRecoilValue(WorkspaceItemSelector(id)) as Workspace

  const [currentPage, setCurrentPage] = useState<ModalEditWorkspacePages>(
    ModalEditWorkspacePages.General
  )

  const isEditing = useMemo(() => !!workspace?.id, [workspace])
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
          condition: false,
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
    []
  )

  const onClickBack = useCallback(() => {
    return navigate('/')
  }, [navigate])

  useEffect(() => {
    if (!workspace) return

    setValues({
      ...workspace,
      name: normalize(workspace.name),
    })
  }, [workspace, setValues])

  return (
    <>
      <div className="flex flex-col p-3 h-full w-[275px] bg-background rounded-l-md border border-border/75 overflow-hidden">
        <div className="flex flex-col gap-y-6 flex-grow basis-full overflow-y-auto">
          <button
            type="button"
            className="cursor-default flex items-center gap-x-2"
            onClick={onClickBack}
          >
            <Lucide icon="ChevronLeft" size={24} />
            <span className="font-light">
              {isEditing ? 'Edit workspace' : 'Create workspace'}
            </span>
          </button>
          {isEditing && <WorkspaceSelector />}
          <ul className="flex flex-col gap-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={classNames({
                    'cursor-default flex items-center gap-x-2 w-full py-1 px-2 rounded hover:bg-border':
                      true,
                    'bg-border text-white': currentPage === item.page,
                  })}
                  onClick={() => setCurrentPage(item.page)}
                >
                  <Lucide icon={item.icon} size={14} />
                  <span className="font-light text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col bg-background rounded-r-md border border-l-0 border-border/75 flex-1 h-full overflow-hidden">
        <TopBar />
        <div className="relative w-full flex-1 flex-grow basis-0 overflow-y-auto p-4 pb-16">
          {isGeneralPage && (
            <ModalEditWorkspaceGeneralSettings
              workspace={workspace}
              isEditing={isEditing}
            />
          )}
          {isBrowserPage && <ModalEditWorkspaceBrowser workspace={workspace} />}
          {isTerminalPage && (
            <ModalEditWorkspaceTerminal workspace={workspace} />
          )}
          {isDockerPage && <ModalEditWorkspaceDocker />}
          {isInstallationPage && (
            <ModalEditWorkspaceInstallation workspace={workspace} />
          )}
          <ButtonMain
            type="submit"
            sm
            bordered
            secondary
            disabled={!isValid || !dirty}
            className="fixed bottom-6 right-6"
          >
            Save workspace
          </ButtonMain>
        </div>
      </div>
    </>
  )
}
