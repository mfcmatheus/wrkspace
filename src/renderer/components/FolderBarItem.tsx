import classNames from 'classnames'
import React, { useMemo } from 'react'

import Folder from 'renderer/@types/Folder'
import ShadowMain from 'renderer/base-components/ShadowMain'
import Lucide from 'renderer/base-components/lucide'
import initials from 'renderer/helpers/initials'

interface FolderBarItemProps {
  folder: Folder
  current?: boolean
  onClick?: (folder: Folder) => void
}

function FolderBarItem(props: FolderBarItemProps) {
  const { folder, current, onClick } = props

  const nameInitials = initials(folder.name, 3)

  const Element = useMemo(() => {
    return current ? ShadowMain : 'div'
  }, [current])

  return (
    <Element
      shadowClassName="!rounded-full"
      wrapperClassName="rounded-full"
      className="rounded-full"
    >
      <button
        title={folder.name}
        type="button"
        className={classNames({
          'relative border border-transparent text-[#6f6f6f] rounded-full h-12 w-12 flex items-center justify-center uppercase font-extrabold transition ease-in-out duration-200':
            true,
          'text-highlight-secondary': current,
          '!border-[#6f6f6f] hover:!border-highlight-primary hover:text-highlight-primary':
            !current,
        })}
        onClick={() => onClick?.(folder)}
      >
        {nameInitials}

        {!folder.path && (
          <div
            title="Missing path"
            className="absolute bottom-0 right-0 rounded-full h-3 w-3 bg-yellow-600"
          >
            <Lucide icon="Info" size={12} color="#fff" />
          </div>
        )}
      </button>
    </Element>
  )
}

FolderBarItem.defaultProps = {
  current: false,
  onClick: () => {},
}

export default FolderBarItem
