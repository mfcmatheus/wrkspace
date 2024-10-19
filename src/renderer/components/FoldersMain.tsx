import classNames from 'classnames'
import React from 'react'
import { useRecoilCallback, useRecoilValue, waitForAll } from 'recoil'
import Lucide from 'renderer/base-components/lucide'
import FolderAtom from 'renderer/store/atoms/FolderAtom'
import SettingIsMenuFolderOpened from 'renderer/store/selectors/SettingIsMenuFolderOpened'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import FoldersMainItem from './FoldersMainItem'

export default function FoldersMain() {
  const [folders, isMenuFolderOpened] = useRecoilValue(
    waitForAll([FolderAtom, SettingIsMenuFolderOpened])
  )

  const onClickMenu = useRecoilCallback(({ set }) => () => {
    set(SettingDefaultSelector, {
      isMenuFolderOpened: !isMenuFolderOpened,
    })
  })

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2 px-2">
        <button
          type="button"
          className="cursor-default flex-1 text-left text-sm"
          onClick={() => onClickMenu()}
        >
          Folders
        </button>
        <button type="button" className="cursor-default">
          <Lucide icon="Plus" size={18} />
        </button>
        <button
          type="button"
          className={classNames({
            'cursor-default text-white transition-all ease-in-out duration-200':
              true,
            'text-[#d2d2d2] rotate-180 transform': !isMenuFolderOpened,
          })}
          onClick={() => onClickMenu()}
        >
          <Lucide icon="ChevronDown" size={14} />
        </button>
      </div>
      {isMenuFolderOpened && (
        <ul className="flex flex-col">
          {folders.map((folder) => (
            <FoldersMainItem key={folder.id} folder={folder} />
          ))}
        </ul>
      )}
    </div>
  )
}
