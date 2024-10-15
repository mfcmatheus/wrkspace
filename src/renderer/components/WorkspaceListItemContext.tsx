import React, { useCallback, useMemo } from 'react'
import { Item, Menu, RightSlot, Separator, Submenu } from 'react-contexify'
import 'react-contexify/ReactContexify.css'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import Folder from 'renderer/@types/Folder'

import Workspace from 'renderer/@types/Workspace'
import Lucide from 'renderer/base-components/lucide'
import { useUser } from 'renderer/contexts/UserContext'
import useWorkspace from 'renderer/hooks/useWorkspace'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'

interface WorkspaceListItemContextProps {
  id: string | number
  workspace: Workspace
  folders: Folder[]
  onLaunch?: (workspace: Workspace) => void
  onNewTerminal?: (workspace: Workspace) => void
  onUninstall?: (workspace: Workspace) => void
}

const defaultProps = {
  onLaunch: null,
  onNewTerminal: null,
  onUninstall: null,
}

function WorkspaceListItemContext(props: WorkspaceListItemContextProps) {
  const { id, workspace, folders, onLaunch, onNewTerminal, onUninstall } = props

  const navigate = useNavigate()
  const { hasCloudSync } = useUser()
  const { hasSyncEnabled, isSynced } = useWorkspace(workspace)

  const updateWorkspace = useSetRecoilState(WorkspaceItemSelector(workspace.id))

  const styles: React.CSSProperties = useMemo(
    () => ({
      '--contexify-menu-bgColor': 'hsl(var(--border))',
      '--contexify-separator-color': '#4c4c4c',
      '--contexify-item-color': '#fff',
      '--contexify-activeItem-color': 'hsl(var(--background))',
      '--contexify-activeItem-bgColor': '#fff',
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
    () => navigate(`/${workspace.id}/edit`),
    [navigate, workspace]
  )

  const onClickFavorite = useCallback(
    () => updateWorkspace({ ...workspace, favorite: !workspace.favorite }),
    [workspace, updateWorkspace]
  )

  const onClickFolder = useCallback(
    (folder: Folder) =>
      updateWorkspace({
        ...workspace,
        folder: folder.id === workspace.folder?.id ? undefined : folder,
      }),
    [workspace, updateWorkspace]
  )

  const onClickUninstall = useCallback(() => {
    return onUninstall?.(workspace)
  }, [workspace, onUninstall])

  const matchShortcutEdit = useCallback(
    (e: KeyboardEvent) => e.metaKey && e.key === 'e',
    []
  )

  const onClickNewTerminal = useCallback(() => {
    return onNewTerminal?.(workspace)
  }, [workspace, onNewTerminal])

  return (
    <Menu id={id} style={styles}>
      <Item id="launch" onClick={onClickLaunch}>
        Launch
      </Item>
      <Item id="launch" onClick={onClickNewTerminal}>
        New terminal
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
