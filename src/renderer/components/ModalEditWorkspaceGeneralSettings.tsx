import React from 'react'
import { ErrorMessage, useField } from 'formik'

import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

function ModalEditWorkspaceGeneralSettings() {
  const pathFieldHelpers = useField('path')[2]

  const onClickSearch = () => {
    ipcRenderer.sendMessage('dialog:openDirectory')
  }

  const renderError = (message: string) => (
    <p className="text-xs text-red-500">{message}</p>
  )

  useIpc('dialog:openDirectory', (path: string) => {
    pathFieldHelpers.setValue(path)
  })

  return (
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto h-full p-3">
      <div className="flex flex-col">
        <label htmlFor="name" className="flex flex-col">
          <span className="text-white font-thin mb-2">Workspace name</span>
          <InputMain name="name" id="name" placeholder="Workspace name" />
        </label>
        <ErrorMessage name="name" render={renderError} />
      </div>
      <div className="flex flex-col">
        <label htmlFor="path" className="flex flex-col">
          <span className="text-white font-thin mb-2">Workspace folder</span>
          <div className="flex">
            <InputMain name="path" id="path" placeholder="Workspace path" />
            <ButtonMain primary onClick={onClickSearch}>
              SEARCH
            </ButtonMain>
          </div>
        </label>
        <ErrorMessage name="path" render={renderError} />
      </div>
    </div>
  )
}

export default ModalEditWorkspaceGeneralSettings
