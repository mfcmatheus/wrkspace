import React, { useCallback } from 'react'
import { Formik } from 'formik'
import moment from 'moment'

import NewFolderFormSchema from 'renderer/@schemas/NewFolderFormSchema'
import Folder from 'renderer/@types/Folder'
import ModalCreateFolderForm from './ModalCreateFolderForm'

interface ModalCreateFolderProps {
  onClose?: () => void
  onSave?: (folder: Folder) => void
}

function ModalCreateFolder(props: ModalCreateFolderProps) {
  const { onClose, onSave } = props

  const onClickClose = useCallback(() => onClose && onClose(), [onClose])

  const onSubmit = useCallback(
    (data: Folder) => {
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
      return onSave?.(data)
    },
    [onSave]
  )

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-[3] inset-0 bg-black/[.6] backdrop-blur-sm"
        onClick={onClickClose}
      />
      <div className="flex flex-col relative z-[4] m-auto bg-[#202020] rounded-lg h-auto w-[40vw] shadow py-4 px-8">
        <span className="text-white font-thin mb-3 mx-auto">Create folder</span>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={NewFolderFormSchema}
          onSubmit={onSubmit}
        >
          <ModalCreateFolderForm />
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
