import React, { useCallback, useMemo } from 'react'
import { Item, Menu, RightSlot, Separator, Submenu } from 'react-contexify'
import 'react-contexify/ReactContexify.css'
import Folder from 'renderer/@types/Folder'

import Workspace from 'renderer/@types/Workspace'
import Lucide from 'renderer/base-components/lucide'
import { useUser } from 'renderer/contexts/UserContext'
import useWorkspace from 'renderer/hooks/useWorkspace'

interface WorkspaceListItemContextProps {
  id: string | number
  workspace: Workspace
  folders: Folder[]
  onEdit?: (workspace: Workspace) => void
  onLaunch?: (workspace: Workspace) => void
  onFavorite?: (workspace: Workspace) => void
  onSetFolder?: (workspace: Workspace, folder: Folder | undefined) => void
  onUninstall?: (workspace: Workspace) => void
}

const defaultProps = {
  onEdit: null,
  onLaunch: null,
  onFavorite: null,
  onSetFolder: null,
  onUninstall: null,
}

function WorkspaceListItemContext(props: WorkspaceListItemContextProps) {
  const {
    id,
    workspace,
    folders,
    onEdit,
    onLaunch,
    onFavorite,
    onSetFolder,
    onUninstall,
  } = props

  const { hasCloudSync } = useUser()
  const { hasSyncEnabled, isSynced } = useWorkspace(workspace)

  const styles: React.CSSProperties = useMemo(
    () => ({
      '--contexify-menu-bgColor': 'rgba(40,40,40,.98)',
      '--contexify-separator-color': '#4c4c4c',
      '--contexify-item-color': '#fff',
      '--contexify-activeItem-color': '#fff',
      '--contexify-activeItem-bgColor': 'oklch(59.59% 0.24 255.09156059071347)',
      '--contexify-rightSlot-color': '#6f6e77',
      '--contexify-activeRightSlot-color': '#fff',
      '--contexify-arrow-color': '#6f6e77',
      '--contexify-activeArrow-color': '#fff',
      '--contexify-menu-minWidth': '150px',
    }),
    []
  )

  const onClickLaunch = useCallback(
    () => onLaunch?.(workspace),
    [workspace, onLaunch]
  )
  const onClickEdit = useCallback(
    () => onEdit?.(workspace),
    [workspace, onEdit]
  )
  const onClickFavorite = useCallback(
    () => onFavorite?.(workspace),
    [workspace, onFavorite]
  )
  const onClickFolder = useCallback(
    (folder: Folder) => {
      return onSetFolder?.(
        workspace,
        folder.id === workspace.folder?.id ? undefined : folder
      )
    },
    [workspace, onSetFolder]
  )

  const onClickUninstall = useCallback(() => {
    return onUninstall?.(workspace)
  }, [workspace, onUninstall])

  const matchShortcutEdit = useCallback(
    (e: KeyboardEvent) => e.metaKey && e.key === 'e',
    []
  )

  return (
    <Menu id={id} style={styles}>
      <Item id="launch" onClick={onClickLaunch}>
        Launch
      </Item>
      <Item id="favorite" onClick={onClickFavorite}>
        <span>{workspace.favorite ? 'Unpin' : 'Pin'}</span>
        <Lucide
          className="ml-auto"
          icon={workspace.favorite ? 'StarOff' : 'Star'}
          size={16}
        />
      </Item>
      <Submenu label="Move to">
        {folders.map((folder) => (
          <Item
            key={folder.id}
            id={`folder-${folder.id}`}
            className="text-ellipsis"
            onClick={() => onClickFolder(folder)}
          >
            {folder.name}
            {folder.id === workspace.folder?.id && (
              <Lucide className="ml-auto" icon="Check" size={16} />
            )}
          </Item>
        ))}
      </Submenu>
      <Separator />
      <Item id="edit" onClick={onClickEdit} keyMatcher={matchShortcutEdit}>
        Edit <RightSlot>⌘E</RightSlot>
      </Item>
      {hasCloudSync && hasSyncEnabled && isSynced && (
        <Item
          id="uninstall"
          onClick={onClickUninstall}
          className="bg-red-700 rounded"
        >
          Uninstall
        </Item>
      )}
    </Menu>
  )
}

WorkspaceListItemContext.defaultProps = defaultProps

export default WorkspaceListItemContext
