import classNames from 'classnames'
import React from 'react'
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  waitForAll,
} from 'recoil'
import Folder from 'renderer/@types/Folder'
import Lucide from 'renderer/base-components/lucide'
import FolderAtom from 'renderer/store/atoms/FolderAtom'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import SettingCurrentFolderSelector from 'renderer/store/selectors/SettingCurrentFolderSelector'
import SettingIsMenuFolderOpened from 'renderer/store/selectors/SettingIsMenuFolderOpened'
import SettingSelector from 'renderer/store/selectors/SettingSelector'

export default function FoldersMain() {
  const [folders, currentFolder, settings, isMenuFolderOpened] = useRecoilValue(
    waitForAll([
      FolderAtom,
      SettingCurrentFolderSelector,
      SettingAtom,
      SettingIsMenuFolderOpened,
    ])
  )

  const onClickFolder = useRecoilCallback(({ set }) => (folder: Folder) => {
    set(SettingSelector, {
      ...settings,
      currentFolder: currentFolder?.id === folder.id ? undefined : folder,
    })
  })

  const onClickMenu = useRecoilCallback(({ set }) => () => {
    set(SettingSelector, {
      ...settings,
      isMenuFolderOpened: !isMenuFolderOpened,
    })
  })

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2 px-2">
        <button
          type="button"
          className="flex-1 text-left text-sm"
          onClick={() => onClickMenu()}
        >
          Folders
        </button>
        <button type="button">
          <Lucide icon="Plus" size={18} />
        </button>
        <button
          type="button"
          className={classNames({
            'text-white transition-all ease-in-out duration-200': true,
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
            <li key={folder.id} className="w-full">
              <button
                type="button"
                className={classNames({
                  'flex items-center gap-x-2 w-full py-1 px-2 rounded text-[#d2d2d2] hover:bg-border transition ease-in-out duration-200':
                    true,
                  'bg-border text-white': currentFolder?.id === folder.id,
                })}
                onClick={() => onClickFolder(folder)}
              >
                <Lucide icon="Folder" size={14} />
                <span className="font-light text-sm">{folder.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
