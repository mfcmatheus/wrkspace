import React from 'react'
import Lucide from 'renderer/base-components/lucide'

interface FolderBarProps {
  children?: React.ReactNode
  onClickCreate?: () => void
}

function FolderBar(props: FolderBarProps) {
  const { children, onClickCreate } = props

  return (
    <div className="flex flex-col gap-y-3 h-full overflow-hidden border-l border-[#353535] p-2">
      <div className="flex border-b border-[#353535] pb-3">
        <button
          type="button"
          className="border border-dashed border-[#6f6f6f] rounded-full h-12 w-12 flex items-center justify-center opacity-50"
          onClick={onClickCreate}
        >
          <Lucide icon="Plus" size={24} color="#6f6f6f" />
        </button>
      </div>
      <div className="flex flex-col flex-grow basis-0 relative overflow-auto gap-y-3 items-center">
        {children}
      </div>
    </div>
  )
}

FolderBar.defaultProps = {
  children: null,
  onClickCreate: null,
}

export default FolderBar
