import React, { useCallback, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'

import moment from 'moment'
import { useLazyQuery } from '@apollo/client'
import TopBar from 'renderer/components/TopBar'
import WorkspaceList from 'renderer/components/WorkspaceList'
import ModalEditWorkspace from 'renderer/components/ModalEditWorkspace'
import WorkspaceListItem from 'renderer/components/WorkspaceListItem'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import FolderBar from 'renderer/components/FolderBar'
import ModalCreateFolder from 'renderer/components/ModalCreateFolder'
import Folder from 'renderer/@types/Folder'
import FolderBarItem from 'renderer/components/FolderBarItem'
import Setting from 'renderer/@types/Setting'
import Lucide from 'renderer/base-components/lucide'
import ModalSettings from 'renderer/components/ModalSettings'
import Logo from 'renderer/base-components/Logo'
import ShadowMain from 'renderer/base-components/ShadowMain'
import LogsMain from 'renderer/components/LogsMain'
import FolderBarAuth from 'renderer/components/FolderBarAuth'
import CloudSyncIndicator from 'renderer/components/CloudSyncIndicator'
import { useCloudSync } from 'renderer/contexts/CloudSyncContext'
import client from 'renderer/graphql/client'
import WorkspaceQuery from 'renderer/graphql/queries/WorkspaceQuery'

const apolloClient = client('/user')

function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [settings, setSettings] = useState<Setting>({} as Setting)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalSettingsOpen, setIsModalSettingsOpen] = useState(false)
  const [isModalCreateFolderOpen, setIsModalCreateFolderOpen] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    {} as Workspace
  )
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)

  const { workspaces: toInstall, setLoading: setLoadingPreview } =
    useCloudSync()

  const [getWorkspace] = useLazyQuery(WorkspaceQuery, {
    client: apolloClient,
  })

  const onEditWorkspace = useCallback((workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setIsModalEditOpen(true)
  }, [])

  const onClickCreate = useCallback(() => {
    setSelectedWorkspace({} as Workspace)
    setIsModalEditOpen(true)
  }, [])

  const onSave = useCallback((workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.update', workspace)
    setIsModalEditOpen(false)
  }, [])

  const onDelete = useCallback((workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.delete', workspace)
    setIsModalEditOpen(false)
  }, [])

  const onCreate = useCallback((workspace: Workspace) => {
    ipcRenderer.sendMessage('workspaces.create', workspace)
    setIsModalEditOpen(false)
  }, [])

  const onInstall = useCallback(
    async (workspace: Workspace) => {
      setLoadingPreview(workspace)

      const { data } = await getWorkspace({ variables: { id: workspace.id } })

      ipcRenderer.sendMessage('workspaces.install', data.Workspace)
    },
    [getWorkspace, setLoadingPreview]
  )

  const onFavorite = useCallback(
    (workspace: Workspace) => {
      return onSave({
        ...workspace,
        favorite: !workspace.favorite,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
    },
    [onSave]
  )

  const onSetFolder = useCallback(
    (workspace: Workspace, folder: Folder | undefined) => {
      return onSave({
        ...workspace,
        folder,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
    },
    [onSave]
  )

  const onCreateFolder = useCallback((folder: Folder) => {
    ipcRenderer.sendMessage('folders.create', folder)
    setIsModalCreateFolderOpen(false)
  }, [])

  const onUpdateFolder = useCallback(
    (folder: Folder) => {
      const index = folders.findIndex((f) => f.id === folder.id)
      const updatedFolders = [...folders]
      updatedFolders[index] = folder

      ipcRenderer.sendMessage('folders.set', updatedFolders)

      setIsModalCreateFolderOpen(false)
      setSelectedFolder(null)
    },
    [folders]
  )

  const onClickFolder = useCallback(
    (folder: Folder) => {
      const currentFolder = settings?.currentFolder

      ipcRenderer.sendMessage('settings.update', {
        currentFolder: currentFolder?.id === folder.id ? null : folder,
      } as Setting)
    },
    [settings]
  )

  const onSaveSettings = useCallback((setting: Setting) => {
    const { folders: updatedFolders, defaultPath } = setting

    ipcRenderer.sendMessage('folders.set', updatedFolders)
    ipcRenderer.sendMessage('settings.update', { defaultPath } as Setting)

    setIsModalSettingsOpen(false)
  }, [])

  const onCloseModalCreateFolder = useCallback(() => {
    setIsModalCreateFolderOpen(false)
    setSelectedFolder(null)
  }, [])

  const title = useMemo(() => {
    return settings?.currentFolder?.name ?? 'Dashboard'
  }, [settings?.currentFolder])

  const filteredWorkspaces = useMemo(() => {
    let data = workspaces.filter((workspace) => {
      return settings?.currentFolder
        ? workspace.folder?.id === settings?.currentFolder?.id
        : true
    })

    data = _.orderBy(
      data,
      [
        (w) => !!w.favorite,
        (w) =>
          w.opened_at
            ? moment(w.opened_at, 'YYYY-MM-DD HH:mm:ss').format('x')
            : '',
        'name',
      ],
      ['desc', 'desc', 'asc']
    )

    if (toInstall?.length) {
      data = data.concat(_.orderBy(toInstall, ['name'], ['asc']))
    }

    return data
  }, [workspaces, settings?.currentFolder, toInstall]) as Workspace[]

  useEffect(() => {
    ipcRenderer.sendMessage('folders.get')
    ipcRenderer.sendMessage('settings.get')
    ipcRenderer.sendMessage('workspaces.get')
  }, [])

  useIpc('workspaces.reload', (data: Workspace[]) => {
    setWorkspaces(data)
  })

  useIpc('folders.reload', (data: Folder[]) => {
    setFolders(data)
  })

  useIpc('workspaces.get', (data: Workspace[]) => {
    setWorkspaces(data)
  })

  useIpc('folders.get', (data: Folder[]) => {
    setFolders(data)
  })

  useIpc('settings.get', (data: Setting) => {
    setSettings(data)

    if (data.currentFolder && !data.currentFolder.path) {
      setIsModalCreateFolderOpen(true)
      setSelectedFolder(data.currentFolder)
    }
  })

  useIpc('settings.reload', (data: Setting) => {
    setSettings(data)

    if (data.currentFolder && !data.currentFolder.path) {
      setIsModalCreateFolderOpen(true)
      setSelectedFolder(data.currentFolder)
    }
  })

  return (
    <>
      <TopBar />
      <div className="flex flex-1">
        <div className="flex flex-col flex-1">
          {filteredWorkspaces?.length ? (
            <div className="flex flex-col flex-1 p-4 relative">
              <div className="flex items-center mb-4">
                <h2 className="text-medium text-[#f0f0f0] text-xl">{title}</h2>
                <div className="flex items-center gap-x-3 ml-auto">
                  <CloudSyncIndicator />
                  <ButtonMain sm bordered secondary onClick={onClickCreate}>
                    Create Workspace
                  </ButtonMain>
                </div>
              </div>
              <WorkspaceList>
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceListItem
                    key={
                      workspace.path ? workspace.id : `${workspace.id}-preview`
                    }
                    workspace={workspace}
                    folders={folders}
                    onEdit={onEditWorkspace}
                    onFavorite={onFavorite}
                    onSetFolder={onSetFolder}
                    onInstall={onInstall}
                  />
                ))}
              </WorkspaceList>
              <div className="flex flex-col items-center justify-center absolute top-[50%] left-[50%] z-[-1] h-[20rem] w-[20rem] transform translate-x-[-50%] translate-y-[-50%]">
                <Logo color="#252525" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center h-full justify-center">
              <p className="text-lg text-[#727272] font-thin">
                No workspaces yet, start using Wrkspace creating one
              </p>
              <ShadowMain
                shadow
                wrapperClassName="rounded-[7px] mt-5"
                shadowClassName="!rounded-[7px]"
                className="rounded-[7px]"
              >
                <ButtonMain highlight bordered sm onClick={onClickCreate}>
                  Create workspace
                </ButtonMain>
              </ShadowMain>
            </div>
          )}
          <LogsMain />
        </div>
        <FolderBar onClickCreate={() => setIsModalCreateFolderOpen(true)}>
          <div className="flex flex-col flex-grow basis-0 relative overflow-auto gap-y-3 items-center">
            {folders.map((folder) => (
              <FolderBarItem
                key={folder.id}
                folder={folder}
                current={settings?.currentFolder?.id === folder.id}
                onClick={onClickFolder}
              />
            ))}
          </div>
          <div className="flex flex-col items-center mt-auto border-t border-[#353535] pt-2 relative">
            <FolderBarAuth />
            <button
              type="button"
              className="flex h-12 w-12 justify-center items-center"
              onClick={() => setIsModalSettingsOpen(true)}
            >
              <Lucide
                icon="Settings"
                size={32}
                color="#6f6f6f"
                strokeWidth={1}
              />
            </button>
          </div>
        </FolderBar>
      </div>

      {isModalEditOpen && (
        <ModalEditWorkspace
          workspace={selectedWorkspace as Workspace}
          settings={settings}
          onClose={() => setIsModalEditOpen(false)}
          onSave={onSave}
          onDelete={onDelete}
          onCreate={onCreate}
        />
      )}

      {isModalSettingsOpen && (
        <ModalSettings
          folders={folders}
          settings={settings}
          onClose={() => setIsModalSettingsOpen(false)}
          onSave={onSaveSettings}
        />
      )}

      {isModalCreateFolderOpen && (
        <ModalCreateFolder
          folder={selectedFolder}
          onCreate={onCreateFolder}
          onUpdate={onUpdateFolder}
          onClose={onCloseModalCreateFolder}
        />
      )}
    </>
  )
}

export default Dashboard
