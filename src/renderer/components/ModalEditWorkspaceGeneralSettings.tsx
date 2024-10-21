import React, { useCallback } from 'react'
import { ErrorMessage, useField, useFormikContext } from 'formik'

import classNames from 'classnames'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import SwitchMain from 'renderer/base-components/SwitchMain'
import SelectMain from 'renderer/base-components/SelectMain'
import Lucide from 'renderer/base-components/lucide'
import normalize from 'renderer/helpers/normalize'
import ElectronApi from 'services/ElectronApi'
import ApplicationSelector from 'renderer/store/selectors/ApplicationSelector'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'
import Workspace from 'renderer/@types/Workspace'
import { useToast } from 'renderer/contexts/ToastContext'
import DeleteButton from './DeleteButton'

interface Props {
  isEditing: boolean
  workspace: Workspace
}

function ModalEditWorkspaceGeneralSettings(props: Props) {
  const { isEditing, workspace } = props

  const { showSuccess } = useToast()
  const navigate = useNavigate()
  const updateWorkspace = useSetRecoilState(
    WorkspaceItemSelector(workspace?.id)
  )
  const applications = useRecoilValue(ApplicationSelector)
  const { errors, setFieldValue } = useFormikContext()
  const pathFieldHelpers = useField('path')[2]
  const [enableEditorField] = useField('features.enableEditor')

  const onClickSearch = useCallback(() => {
    const path = ElectronApi.call('dialog:openDirectory')
    pathFieldHelpers.setValue(path)
  }, [pathFieldHelpers])

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  const onClickUnarchive = useCallback(() => {
    updateWorkspace({
      ...workspace,
      archived_at: null,
    })
    showSuccess('Workspace unarchived successfully')
    navigate('/')
  }, [updateWorkspace, workspace, showSuccess, navigate])

  const onClickArchive = useCallback(() => {
    updateWorkspace({
      ...workspace,
      archived_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })
    showSuccess('Workspace archived successfully')
    navigate('/')
  }, [updateWorkspace, workspace, showSuccess, navigate])

  const onClickDelete = useCallback(() => {
    ElectronApi.call('workspaces.delete', workspace)
    showSuccess('Workspace deleted successfully')
    navigate('/')
  }, [workspace, showSuccess, navigate])

  return (
    <div className="flex flex-col gap-y-8 p-[1px]">
      <div className="flex flex-col gap-y-1 flex-1">
        <p className="text-white">General settings</p>
        <span className="text-sm text-zinc-400 font-thin">
          Configure your workspace settings.
        </span>
      </div>
      <div className="flex flex-col border border-border p-5 rounded-lg bg-muted">
        <label htmlFor="name" className="flex flex-col gap-y-4">
          <span className="text-white">Workspace name</span>
          <p className="font-thin text-sm">
            Your workspace name is displayed on your workspace and in the
            workspace directory.
          </p>
          <InputMain
            name="name"
            id="name"
            placeholder="Workspace name"
            containerClasses={classNames({
              'border border-red-500': errors.name,
            })}
            onChange={(e) => setFieldValue('name', normalize(e.target.value))}
          />
        </label>
      </div>
      <div className="flex flex-col border border-border p-5 rounded-lg bg-muted">
        <label htmlFor="path" className="flex flex-col gap-y-4">
          <span className="text-white">Workspace path</span>
          <p className="font-thin text-sm">
            The path to your workspace is where your workspace files are stored.
          </p>
          <div className="flex">
            <InputMain
              name="path"
              id="path"
              placeholder="Workspace path"
              containerClasses={classNames({
                '!rounded-r-none': true,
                'border border-red-500': errors.path,
              })}
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
        </label>
      </div>
      <div className="flex flex-col border border-border p-5 rounded-lg bg-muted">
        <label htmlFor="enableEditor" className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Open with editor</span>
            <div className="flex items-center gap-x-2">
              <SwitchMain
                sm
                primary
                name="features.enableEditor"
                id="enableEditor"
              />
              <span className="text-sm font-light">
                {enableEditorField.value ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <p className="font-thin text-sm">
            Choose the application to open your workspace files with.
          </p>
          <div className="flex gap-x-2">
            <SelectMain name="editor" disabled={!enableEditorField.value}>
              {applications.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </SelectMain>
          </div>
        </label>
        <ErrorMessage name="editor" render={renderError} />
      </div>
      {isEditing && (
        <div className="flex flex-col border border-destructive/50 p-5 rounded-lg bg-muted">
          <label htmlFor="path" className="flex flex-col gap-y-4">
            <span className="text-white">Danger zone</span>
            <p className="font-thin text-sm">
              Be careful with the actions you take in this section. They are not
              reversible.
            </p>
            <div className="flex items-center mt-6 border-b border-border pb-6 mb-2">
              <p className="font-thin text-sm w-9/12">
                Archive your workspace and its files. This will remove the
                workspace from the app but keep the files on your computer.
              </p>
              {workspace.archived_at ? (
                <ButtonMain
                  sm
                  primary
                  bordered
                  onClick={onClickUnarchive}
                  className="w-3/12"
                >
                  Unarchive workspace
                </ButtonMain>
              ) : (
                <DeleteButton onClick={onClickArchive} className="w-3/12">
                  Archive workspace
                </DeleteButton>
              )}
            </div>
            <div className="flex items-center">
              <p className="font-thin text-sm w-9/12">
                Deleting a workspace is irreversible. Make sure you have a
                backup of your workspace files.
              </p>
              <DeleteButton onClick={onClickDelete} className="w-3/12">
                Delete workspace
              </DeleteButton>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}

export default ModalEditWorkspaceGeneralSettings
