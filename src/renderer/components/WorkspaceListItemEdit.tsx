import React from 'react'
import Lucide from 'renderer/base-components/lucide'

interface WorkspaceListItemEditProps {
  onClick: () => void
}

function WorkspaceListItemEdit(props: WorkspaceListItemEditProps) {
  const { onClick } = props

  return (
    <button
      type="button"
      className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out"
      onClick={onClick}
    >
      <Lucide icon="Settings" className="text-white" size={20} />
    </button>
  )
}

export default WorkspaceListItemEdit
