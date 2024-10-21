import React from 'react'
import { Item, Menu, Separator } from 'react-contexify'

interface Props {
  id: string | number
  onEdit: () => void
  onRemove: () => void
}

export default function FoldersMainItemContext(props: Props) {
  const { id, onEdit, onRemove } = props

  return (
    <Menu id={id}>
      <Item id="launch" onClick={onEdit}>
        Rename
      </Item>
      <Separator />
      <Item id="launch" onClick={onRemove}>
        Remove
      </Item>
    </Menu>
  )
}
