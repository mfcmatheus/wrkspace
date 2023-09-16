import { Form, Formik } from 'formik'
import React, { useCallback } from 'react'
import NewFolderFormSchema from 'renderer/@schemas/NewFolderFormSchema'
import Folder from 'renderer/@types/Folder'
import ButtonMain from 'renderer/base-components/ButtonMain'

import InputMain from 'renderer/base-components/InputMain'

interface ModalCreateFolderProps {
  onClose?: () => void
  onSave?: (folder: Folder) => void
}

function ModalCreateFolder(props: ModalCreateFolderProps) {
  const { onClose, onSave } = props

  const onClickClose = useCallback(() => onClose && onClose(), [onClose])
  const onSubmit = useCallback(
    (data: Folder) => onSave && onSave(data),
    [onSave]
  )

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-1 inset-0 opacity-[60%] bg-[#000000]"
        onClick={onClickClose}
      />
      <div className="flex flex-col relative z-2 m-auto bg-[#202020] rounded-lg h-auto w-[40vw] shadow py-4 px-8">
        <span className="text-white font-thin mb-3 mx-auto">Create folder</span>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={NewFolderFormSchema}
          onSubmit={onSubmit}
        >
          <Form className="flex flex-col">
            <InputMain className="mt-2" name="name" placeholder="Folder name" />
            <ButtonMain primary className="mt-6 mx-auto" type="submit">
              Create
            </ButtonMain>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

ModalCreateFolder.defaultProps = {
  onClose: null,
  onSave: null,
}

export default ModalCreateFolder
