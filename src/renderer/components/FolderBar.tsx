import React from 'react'
import Lucide from 'renderer/base-components/lucide'

interface FolderBarProps {
  children?: React.ReactNode
  onClickCreate?: () => void
}

function FolderBar(props: FolderBarProps) {
  const { children, onClickCreate } = props

  return (
    <div className="flex flex-col gap-y-3 h-full overflow-auto border-l border-[#353535] p-2">
      <button
        type="button"
        className="border border-dashed border-[#6f6f6f] rounded-full h-12 w-12 flex items-center justify-center opacity-50"
        onClick={onClickCreate}
      >
        <Lucide icon="Plus" size={24} color="#6f6f6f" />
      </button>
      {children}
    </div>
  )
}

FolderBar.defaultProps = {
  children: null,
  onClickCreate: null,
}

export default FolderBar
