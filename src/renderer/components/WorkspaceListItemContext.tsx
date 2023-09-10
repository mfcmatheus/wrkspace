import React from 'react'
import { Item, Menu, RightSlot, Separator } from 'react-contexify'
import 'react-contexify/ReactContexify.css'

import Workspace from 'renderer/@types/Workspace'

interface WorkspaceListItemContextProps {
  id: string | number
  workspace: Workspace
  onEdit?: (workspace: Workspace) => void
  onLaunch?: (workspace: Workspace) => void
}

const defaultProps = {
  onEdit: null,
  onLaunch: null,
}

function WorkspaceListItemContext(props: WorkspaceListItemContextProps) {
  const { id, workspace, onEdit, onLaunch } = props

  const styles: React.CSSProperties = {
    '--contexify-menu-bgColor': 'rgba(40,40,40,.98)',
    '--contexify-separator-color': '#4c4c4c',
    '--contexify-item-color': '#fff',
    '--contexify-activeItem-color': '#fff',
    '--contexify-activeItem-bgColor': '#4f46e5',
    '--contexify-rightSlot-color': '#6f6e77',
    '--contexify-activeRightSlot-color': '#fff',
    '--contexify-arrow-color': '#6f6e77',
    '--contexify-activeArrow-color': '#fff',
    '--contexify-menu-minWidth': '150px',
  }

  const onClickLaunch = () => onLaunch?.(workspace)
  const onClickEdit = () => onEdit?.(workspace)

  const matchShortcutEdit = (e: KeyboardEvent) => e.metaKey && e.key === 'e'

  return (
    <Menu id={id} style={styles}>
      <Item id="launch" onClick={onClickLaunch}>
        Launch
      </Item>
      <Separator />
      <Item id="edit" onClick={onClickEdit} keyMatcher={matchShortcutEdit}>
        Edit <RightSlot>⌘E</RightSlot>
      </Item>
    </Menu>
  )
}

WorkspaceListItemContext.defaultProps = defaultProps

export default WorkspaceListItemContext
