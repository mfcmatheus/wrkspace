import React, { useCallback } from 'react'
import { Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import WorkspaceFormSchema from 'renderer/@schemas/WorkspaceFormSchema'
import Workspace from 'renderer/@types/Workspace'
import normalize from 'renderer/helpers/normalize'
import MainLayout from 'renderer/layouts/MainLayout'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'
import WorkspaceEditContent from 'renderer/components/WorkspaceEdit'
import { useToast } from 'renderer/contexts/ToastContext'

export default function WorkspaceEdit() {
  const { id } = useParams<{ id: string }>()
  const { showSuccess } = useToast()
  const [workspace, updateWorkspace] = useRecoilState(WorkspaceItemSelector(id))

  const onSubmit = useCallback(
    (values: Workspace) => {
      updateWorkspace(values)
      showSuccess('Workspace updated successfully')
    },
    [updateWorkspace, showSuccess]
  )

  return (
    <MainLayout>
      <Formik
        initialValues={{ ...workspace, name: normalize(workspace.name) }}
        validationSchema={WorkspaceFormSchema}
        onSubmit={onSubmit}
      >
        <Form className="flex w-full h-full overflow-hidden">
          <WorkspaceEditContent />
        </Form>
      </Formik>
    </MainLayout>
  )
}
