import React, { useCallback, useEffect, useState } from 'react'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'

import classNames from 'classnames'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import SwitchMain from 'renderer/base-components/SwitchMain'
import SelectMain from 'renderer/base-components/SelectMain'
import Lucide from 'renderer/base-components/lucide'

function ModalEditWorkspaceGeneralSettings() {
  const { errors } = useFormikContext()
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
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto p-3">
      <div className="flex flex-col">
        <label htmlFor="name" className="flex flex-col">
          <span className="text-white font-thin mb-2">Workspace name</span>
          <InputMain
            name="name"
            id="name"
            placeholder="Workspace name"
            containerClasses={classNames({
              'border border-red-500': errors.name,
            })}
          />
        </label>
      </div>
      <div className="flex flex-col">
        <label htmlFor="path" className="flex flex-col">
          <span className="text-white font-thin mb-2">Workspace folder</span>
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
              className="bg-primary rounded-none px-3 font-thin rounded-r-[8px]"
              onClick={onClickSearch}
            >
              <Lucide icon="Search" size={20} color="#000" />
            </ButtonMain>
          </div>
        </label>
      </div>
      <div className="flex flex-col">
        <label htmlFor="enableEditor" className="flex flex-col">
          <span className="text-white font-thin mb-2">Open with editor</span>
          <div className="flex gap-x-2">
            <SelectMain name="editor" disabled={!enableEditorField.value}>
              {applications.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </SelectMain>
            <SwitchMain
              sm
              primary
              name="features.enableEditor"
              id="enableEditor"
            />
          </div>
        </label>
        <ErrorMessage name="editor" render={renderError} />
      </div>
    </div>
  )
}

export default ModalEditWorkspaceGeneralSettings
