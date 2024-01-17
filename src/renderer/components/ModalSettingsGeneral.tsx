import { ErrorMessage, useField } from 'formik'
import React, { useCallback } from 'react'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

function ModalSettingsGeneral() {
  const defaultPathFieldHelpers = useField('defaultPath')[2]

  const onClickSearch = useCallback(() => {
    ipcRenderer.sendMessage('dialog:openDirectory')
  }, [])

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  useIpc('dialog:openDirectory', (path: string) => {
    defaultPathFieldHelpers.setValue(path)
  })

  return (
    <div className="flex flex-col gap-y-2 flex-grow basis-0 overflow-auto p-3">
      <div className="flex flex-col">
        <label htmlFor="defaultPath" className="flex flex-col">
          <span className="text-white font-thin mb-2">
            Default application path
          </span>
          <div className="flex">
            <InputMain
              name="defaultPath"
              id="defaultPath"
              placeholder="Default application path"
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
        </label>
        <ErrorMessage name="path" render={renderError} />
      </div>
    </div>
  )
}

export default ModalSettingsGeneral
