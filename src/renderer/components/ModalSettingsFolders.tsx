import { ErrorMessage, useField } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import Folder from 'renderer/@types/Folder'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import fakeId from 'renderer/helpers/fakeId'
import initials from 'renderer/helpers/initials'

interface ModalSettingsFoldersProps {
  folders: Folder[]
}

function ModalSettingsFolders(props: ModalSettingsFoldersProps) {
  const { folders: storedFolders } = props

  const foldersField = useField('folders')[2]

  const [folders, setFolders] = useState(storedFolders)

  const onClickAddFolder = useCallback(() => {
    const newFolder = {
      id: fakeId(),
      name: '',
    } as Folder

    foldersField.setValue([...folders, newFolder])
  }, [folders, foldersField])

  const onClickRemoveFolder = useCallback(
    (folder: Folder) => {
      const index = folders.findIndex((f) => f.id === folder.id)

      const updatedFolders = [...folders]
      updatedFolders.splice(index, 1)

      foldersField.setValue(updatedFolders)
    },
    [folders, foldersField]
  )

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  useEffect(() => {
    if (!storedFolders?.length) return

    setFolders(storedFolders)
  }, [storedFolders])

  return (
    <div className="flex flex-col gap-y-2 flex-grow basis-0 overflow-auto p-3">
      <div className="flex mb-3">
        <ButtonMain
          className="text-white border border-indigo-600 !text-xs ml-auto"
          onClick={onClickAddFolder}
        >
          New folder
        </ButtonMain>
      </div>
      {folders.map((folder, index: number) => (
        <div key={folder.id} className="flex flex-col">
          <div className="grid grid-cols-12 gap-x-2 bg-[#353535] p-1">
            <span className="flex col-span-2 items-center justify-center text-[#6f6f6f] uppercase font-extrabold">
              {initials(folder.name, 3)}
            </span>
            <InputMain name={`folders[${index}].name`} className="col-span-9" />
            <div className="col-span-1 flex justify-center">
              <button type="button" onClick={() => onClickRemoveFolder(folder)}>
                <Lucide icon="Trash" size={20} color="#dc2626" />
              </button>
            </div>
          </div>
          <div className="col-span-12">
            <ErrorMessage
              name={`folders[${index}].name`}
              render={renderError}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModalSettingsFolders
