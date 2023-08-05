import React, { useState, useEffect } from 'react'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'

interface ModalEditWorkspaceGeneralSettingsProps {
  workspace: Workspace
}

function ModalEditWorkspaceGeneralSettings(
  props: ModalEditWorkspaceGeneralSettingsProps
) {
  const { workspace } = props

  const [name, setName] = useState(workspace.name)
  const [path, setPath] = useState(workspace.path)

  const onClickSearch = () => {
    console.log('search')
  }

  useEffect(() => {
    setName(workspace.name)
    setPath(workspace.path)
  }, [workspace])

  return (
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto h-full p-3">
      <label htmlFor="name" className="flex flex-col">
        <span className="text-white font-thin mb-2">Workspace name</span>
        <InputMain
          value={name}
          id="name"
          placeholder="Workspace name"
          onChange={setName}
        />
      </label>
      <label htmlFor="path" className="flex flex-col">
        <span className="text-white font-thin mb-2">Workspace folder</span>
        <div className="flex">
          <InputMain
            value={path}
            id="path"
            placeholder="Workspace path"
            onChange={setPath}
          />
          <ButtonMain primary onClick={onClickSearch}>
            SEARCH
          </ButtonMain>
          <input type="file" className="hidden" />
        </div>
      </label>
    </div>
  )
}

export default ModalEditWorkspaceGeneralSettings
