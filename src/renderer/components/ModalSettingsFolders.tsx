import classNames from 'classnames'
import { ErrorMessage, useField, useFormikContext } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import Folder from 'renderer/@types/Folder'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import fakeId from 'renderer/helpers/fakeId'
import initials from 'renderer/helpers/initials'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

interface ModalSettingsFoldersProps {
  folders: Folder[]
}

function ModalSettingsFolders(props: ModalSettingsFoldersProps) {
  const { folders: storedFolders } = props

  const foldersField = useField('folders')[2]
  const { errors } = useFormikContext()

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

  const onClickSearch = useCallback((folder: Folder) => {
    ipcRenderer.sendMessage('dialog:openDirectory', folder.id)
  }, [])

  useIpc('dialog:openDirectory', (path: string, reference: string | number) => {
    const index = folders.findIndex((f) => f.id === reference)

    const updatedFolders = [...folders]
    updatedFolders[index].path = path

    foldersField.setValue(updatedFolders)
  })

  useEffect(() => {
    if (!storedFolders?.length) return

    setFolders(storedFolders)
  }, [storedFolders])

  return (
    <div className="flex flex-col gap-y-2 flex-grow basis-0 overflow-auto p-3">
      <div className="flex mb-3">
        <ButtonMain
          sm
          bordered
          secondary
          className="ml-auto"
          onClick={onClickAddFolder}
        >
          New folder
        </ButtonMain>
      </div>
      {folders.map((folder, index: number) => (
        <div
          key={folder.id}
          className="flex flex-col gap-y-2 bg-[#353535] p-5 rounded"
        >
          <div className="flex flex-col">
            <div className="flex gap-x-3">
              <InputMain
                placeholder="Folder name"
                name={`folders[${index}].name`}
                containerClasses={classNames({
                  'border border-red-500': errors.folders?.[index]?.name,
                })}
              />
              <span className="w-[15px] mx-3 flex col-span-1 items-center justify-center text-[#6f6f6f] uppercase font-extrabold">
                {initials(folder.name, 3)}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <InputMain
                name={`folders[${index}].path`}
                placeholder="Folder path"
                containerClasses={classNames({
                  '!rounded-r-none': true,
                  'border border-red-500': errors.folders?.[index]?.path,
                })}
                readOnly
              />
              <ButtonMain
                secondary
                bordered
                className="bg-highlight-primary rounded-none px-3 font-thin rounded-r-[8px]"
                onClick={() => onClickSearch(folder)}
              >
                <Lucide icon="Search" size={20} color="#000" />
              </ButtonMain>
            </div>
          </div>
          <div className="flex items-center mt-3">
            <ButtonMain
              sm
              primary
              bordered
              className="mt-3"
              onClick={() => onClickRemoveFolder(folder)}
            >
              Remove folder
            </ButtonMain>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModalSettingsFolders
