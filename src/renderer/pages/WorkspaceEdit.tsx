import React, { useCallback, useMemo } from 'react'
import { Form, Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import WorkspaceFormSchema from 'renderer/@schemas/WorkspaceFormSchema'
import Workspace from 'renderer/@types/Workspace'
import normalize from 'renderer/helpers/normalize'
import MainLayout from 'renderer/layouts/MainLayout'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'
import WorkspaceEditContent from 'renderer/components/WorkspaceEdit'
import { useToast } from 'renderer/contexts/ToastContext'

export default function WorkspaceEdit() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { showSuccess } = useToast()
  const [workspace, updateWorkspace] = useRecoilState<Workspace>(
    WorkspaceItemSelector(id)
  )

  const isEditing = useMemo(() => {
    return !!workspace?.id
  }, [workspace])

  const onSubmit = useCallback(
    (values: Workspace) => {
      updateWorkspace(values)
      showSuccess(isEditing ? 'Workspace updated' : 'Workspace created')
      navigate('/')
    },
    [updateWorkspace, showSuccess, navigate, isEditing]
  )

  return (
    <MainLayout>
      <Formik
        initialValues={{ ...workspace, name: normalize(workspace?.name ?? '') }}
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
