import { ErrorMessage, Form, useField, useFormikContext } from 'formik'
import React, { useCallback, useMemo } from 'react'
import Folder from 'renderer/@types/Folder'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

interface ModalCreateFolderFormProps {
  folder?: Folder | null
}

function ModalCreateFolderForm(props: ModalCreateFolderFormProps) {
  const { folder } = props

  const pathFieldHelpers = useField('path')[2]

  const isEditing = useMemo(() => !!folder, [folder])

  const onClickSearch = useCallback(() => {
    ipcRenderer.sendMessage('dialog:openDirectory')
  }, [])

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  useIpc('dialog:openDirectory', (path: string) => {
    pathFieldHelpers.setValue(path)
  })

  return (
    <Form className="flex flex-col gap-y-3">
      <label htmlFor="name" className="flex flex-col">
        <span className="text-white font-thin mb-2">Folder name</span>
        <InputMain name="name" placeholder="Folder name" />
        <ErrorMessage name="name" render={renderError} />
      </label>

      <label htmlFor="path" className="flex flex-col">
        <span className="text-white font-thin mb-2">Folder base path</span>
        <div className="flex">
          <InputMain
            name="path"
            id="path"
            placeholder="Folder base path"
            containerClasses="!rounded-r-none"
            readOnly
          />
          <ButtonMain
            secondary
            bordered
            className="bg-highlight-primary rounded-none px-3 font-thin rounded-r-[8px]"
            onClick={onClickSearch}
          >
            <Lucide icon="Search" size={20} color="#000" />
          </ButtonMain>
        </div>
        <ErrorMessage name="path" render={renderError} />
      </label>

      <ButtonMain sm bordered secondary className="mt-6 mx-auto" type="submit">
        {isEditing ? 'Update' : 'Create'}
      </ButtonMain>
    </Form>
  )
}

ModalCreateFolderForm.defaultProps = {
  folder: null,
}

export default ModalCreateFolderForm
