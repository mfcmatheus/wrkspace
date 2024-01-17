import React, { useCallback, useMemo } from 'react'
import { Formik } from 'formik'
import moment from 'moment'

import NewFolderFormSchema from 'renderer/@schemas/NewFolderFormSchema'
import Folder from 'renderer/@types/Folder'
import ModalCreateFolderForm from './ModalCreateFolderForm'

interface ModalCreateFolderProps {
  folder?: Folder | null
  onClose?: () => void
  onCreate?: (folder: Folder) => void
  onUpdate?: (folder: Folder) => void
}

function ModalCreateFolder(props: ModalCreateFolderProps) {
  const { folder, onClose, onCreate, onUpdate } = props

  const isEditing = useMemo(() => !!folder, [folder])

  const initialValues = useMemo(
    () => ({
      name: folder?.name ?? '',
      path: folder?.path ?? '',
    }),
    [folder]
  )

  const onClickClose = useCallback(() => onClose?.(), [onClose])

  const onSubmit = useCallback(
    (data: Folder) => {
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
      return isEditing ? onUpdate?.({ ...folder, ...data }) : onCreate?.(data)
    },
    [folder, onUpdate, onCreate, isEditing]
  )

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-[3] inset-0 bg-black/[.6] backdrop-blur-sm"
        onClick={onClickClose}
      />
      <div className="flex flex-col relative z-[4] m-auto bg-[#202020] rounded-lg h-auto w-[40vw] shadow py-4 px-8">
        <span className="text-white font-thin mb-3 mx-auto">
          {isEditing ? 'Complete folder information' : 'Create folder'}
        </span>
        <Formik
          initialValues={initialValues}
          validationSchema={NewFolderFormSchema}
          onSubmit={onSubmit}
        >
          <ModalCreateFolderForm folder={folder} />
        </Formik>
      </div>
    </div>
  )
}

ModalCreateFolder.defaultProps = {
  folder: null,
  onClose: null,
  onCreate: null,
  onUpdate: null,
}

export default ModalCreateFolder
