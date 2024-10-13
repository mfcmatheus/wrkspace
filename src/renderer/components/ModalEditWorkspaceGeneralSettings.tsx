import React, { useCallback, useEffect, useState } from 'react'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'

import classNames from 'classnames'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import SwitchMain from 'renderer/base-components/SwitchMain'
import SelectMain from 'renderer/base-components/SelectMain'
import Lucide from 'renderer/base-components/lucide'
import normalize from 'renderer/helpers/normalize'
import DeleteButton from './DeleteButton'

interface Props {
  isEditing: boolean
  onClickDelete: () => void
}

function ModalEditWorkspaceGeneralSettings(props: Props) {
  const { isEditing, onClickDelete } = props

  const { errors, setFieldValue } = useFormikContext()
  const pathFieldHelpers = useField('path')[2]
  const [enableEditorField] = useField('features.enableEditor')

  const [applications, setApplications] = useState<string[]>([])

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

  useIpc('applications.get', (data: string[]) => {
    setApplications(data.map((app) => app.replace('.app', '')))
  })

  useEffect(() => {
    ipcRenderer.sendMessage('applications.get')
  }, [])

  return (
    <div className="flex flex-col gap-y-6 flex-grow basis-0 overflow-auto">
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
            <SwitchMain
              sm
              primary
              name="features.enableEditor"
              id="enableEditor"
            />
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
      <div className="flex flex-col border border-destructive/50 p-5 rounded-lg bg-muted">
        <label htmlFor="path" className="flex flex-col gap-y-4">
          <span className="text-white">Danger zone</span>
          <p className="font-thin text-sm">
            Deleting a workspace is irreversible. Make sure you have a backup of
            your workspace files.
          </p>
          {isEditing && (
            <DeleteButton onClick={onClickDelete} className="mr-auto">
              Delete workspace
            </DeleteButton>
          )}
        </label>
      </div>
    </div>
  )
}

export default ModalEditWorkspaceGeneralSettings
