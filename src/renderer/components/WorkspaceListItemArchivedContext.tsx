import React, { useCallback, useMemo } from 'react'
import { Item, Menu, RightSlot, Separator } from 'react-contexify'
import 'react-contexify/ReactContexify.css'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import Workspace from 'renderer/@types/Workspace'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'

interface Props {
  id: string | number
  workspace: Workspace
}

function WorkspaceListItemArchivedContext(props: Props) {
  const { id, workspace } = props

  const navigate = useNavigate()
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

  const onClickEdit = useCallback(
    () => navigate(`/${workspace.id}/edit`),
    [navigate, workspace]
  )

  const onClickUnarchive = useCallback(() => {
    updateWorkspace({
      ...workspace,
      archived_at: null,
    })
  }, [updateWorkspace, workspace])

  const matchShortcutEdit = useCallback(
    (e: KeyboardEvent) => e.metaKey && e.key === 'e',
    []
  )

  return (
    <Menu id={id} style={styles}>
      <Item id="unarchive" onClick={onClickUnarchive}>
        Unarchive
      </Item>
      <Separator />
      <Item id="edit" onClick={onClickEdit} keyMatcher={matchShortcutEdit}>
        Edit <RightSlot>⌘E</RightSlot>
      </Item>
    </Menu>
  )
}

export default WorkspaceListItemArchivedContext
