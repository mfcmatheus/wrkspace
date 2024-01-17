import { ErrorMessage } from 'formik'
import React, { useCallback } from 'react'
import Workspace from 'renderer/@types/Workspace'
import InputMain from 'renderer/base-components/InputMain'
import ModalEditWorkspaceInstallationVariables from './ModalEditWorkspaceInstallationVariables'
import ModalEditWorkspaceInstallationCommands from './ModalEditWorkspaceInstallationCommands'

interface ModalEditWorkspaceInstallationProps {
  workspace: Workspace
}

function ModalEditWorkspaceInstallation(
  props: ModalEditWorkspaceInstallationProps
) {
  const { workspace } = props

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  return (
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto p-3">
      <div className="flex flex-col">
        <label htmlFor="repo" className="flex flex-col">
          <span className="text-white font-thin mb-2">Repository</span>
          <InputMain name="repo" id="repo" placeholder="Workspace repository" />
        </label>
        <ErrorMessage name="repo" render={renderError} />
        <span className="text-sm font-thin text-gray-100 italic mt-2">
          We do not configurate git for you yet. Please make sure that you have
          access to the repository before installing the workspace.
        </span>
      </div>

      <ModalEditWorkspaceInstallationVariables workspace={workspace} />
      <ModalEditWorkspaceInstallationCommands workspace={workspace} />
    </div>
  )
}

export default ModalEditWorkspaceInstallation
