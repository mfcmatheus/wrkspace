import React from 'react'
import Lucide from 'renderer/base-components/lucide'

interface FolderBarProps {
  children?: React.ReactNode
  onClickCreate?: () => void
}

function FolderBar(props: FolderBarProps) {
  const { children, onClickCreate } = props

  return (
    <div className="flex flex-col gap-y-3 h-full">
      <div className="flex border-b border-border pb-3 justify-center">
        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center opacity-75"
          onClick={onClickCreate}
        >
          <Lucide icon="Plus" size={24} color="#6f6f6f" />
        </button>
      </div>
      <div className="flex flex-col flex-grow">{children}</div>
    </div>
  )
}

FolderBar.defaultProps = {
  children: null,
  onClickCreate: null,
}

export default FolderBar
