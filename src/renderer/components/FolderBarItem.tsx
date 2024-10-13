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
    <Element>
      <button
        title={folder.name}
        type="button"
        className={classNames({
          'relative border border-transparent text-accent-foreground bg-muted rounded-md h-11 w-11 flex items-center justify-center uppercase font-extrabold transition ease-in-out duration-200':
            true,
          'text-highlight-secondary': current,
          '!border-border hover:!border-foreground': !current,
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
