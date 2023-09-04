import classNames from 'classnames'
import React from 'react'

import Folder from 'renderer/@types/Folder'
import initials from 'renderer/helpers/initials'

interface FolderBarItemProps {
  folder: Folder
  current?: boolean
  onClick?: (folder: Folder) => void
}

function FolderBarItem(props: FolderBarItemProps) {
  const { folder, current, onClick } = props

  const nameInitials = initials(folder.name, 3)

  return (
    <button
      title={folder.name}
      type="button"
      className={classNames({
        'border border-[#6f6f6f] text-[#6f6f6f] rounded-full h-12 w-12 flex items-center justify-center uppercase font-extrabold hover:border-indigo-600 hover:text-indigo-600 transition ease-in-out duration-200':
          true,
        'border-indigo-600 text-indigo-600': current,
      })}
      onClick={() => onClick?.(folder)}
    >
      {nameInitials}
    </button>
  )
}

FolderBarItem.defaultProps = {
  current: false,
  onClick: () => {},
}

export default FolderBarItem
