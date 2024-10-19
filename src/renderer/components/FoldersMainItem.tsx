import classNames from 'classnames'
import React, { useCallback, useRef, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import {
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
  waitForAll,
} from 'recoil'
import Folder from 'renderer/@types/Folder'
import Lucide from 'renderer/base-components/lucide'
import SettingCurrentFolderSelector from 'renderer/store/selectors/SettingCurrentFolderSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import normalize from 'renderer/helpers/normalize'
import FolderItemSelector from 'renderer/store/selectors/FolderItemSelector'
import ElectronApi from 'services/ElectronApi'
import FoldersMainItemContext from './FoldersMainItemContext'

interface Props {
  folder: Folder
}

export default function FoldersMainItem(props: Props) {
  const { folder } = props
  const updateWorkspace = useSetRecoilState(FolderItemSelector(folder.id))

  const inputRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(folder.name)
  const [currentFolder] = useRecoilValue(
    waitForAll([SettingCurrentFolderSelector])
  )
  const { show: showContextMenu } = useContextMenu({
    id: folder.id,
  })

  const onClickFolder = useRecoilCallback(({ set }) => () => {
    set(SettingDefaultSelector, {
      currentFolder: currentFolder?.id === folder.id ? undefined : folder,
      currentFilter: null,
    })
  })

  const handleContextMenu = useCallback(
    (event: React.MouseEventHandler<HTMLDivElement, MouseEvent>) => {
      showContextMenu({ event })
    },
    [showContextMenu]
  )

  const onEditFolder = useCallback(() => {
    setEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
  }, [])

  const onSaveFolder = useCallback(() => {
    setEditing(false)
    updateWorkspace({ ...folder, name: newName })
  }, [folder, newName, updateWorkspace])

  const onRemoveFolder = useCallback(() => {
    ElectronApi.call('folders.delete', folder)
  }, [folder])

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSaveFolder()
      }
      if (e.key === 'Escape') {
        setNewName(folder.name)
        setEditing(false)
      }
    },
    [folder.name, onSaveFolder]
  )

  return (
    <>
      <li className="w-full" onContextMenu={handleContextMenu}>
        <button
          type="button"
          className={classNames({
            'cursor-default flex items-center gap-x-2 w-full py-1 px-2 rounded text-[#d2d2d2] hover:bg-border':
              true,
            'bg-border text-white': currentFolder?.id === folder.id,
          })}
          onClick={onClickFolder}
        >
          <Lucide icon="Folder" size={14} />
          {!editing ? (
            <span className="font-light text-sm">{folder.name}</span>
          ) : (
            <input
              ref={inputRef}
              className="flex-1 cursor-default appearance-none ring-0 font-light text-sm p-0 m-0 bg-transparent border-transparent outline-none focus:border-none select-none"
              type="text"
              value={newName}
              onChange={(e) => setNewName(normalize(e.target.value))}
              onKeyUp={onKeyUp}
              onBlur={onSaveFolder}
            />
          )}
        </button>
      </li>
      <FoldersMainItemContext
        id={folder.id}
        onEdit={onEditFolder}
        onRemove={onRemoveFolder}
      />
    </>
  )
}
