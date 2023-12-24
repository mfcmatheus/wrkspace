import { useField } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import EnvVar from 'renderer/@types/EnvVar'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import fakeId from 'renderer/helpers/fakeId'

interface ModalEditWorkspaceInstallationVariablesProps {
  workspace: Workspace
}

export default function ModalEditWorkspaceInstallationVariables(
  props: ModalEditWorkspaceInstallationVariablesProps
) {
  const { workspace } = props

  const [field, meta, helpers] = useField('installation.variables')
  const [variables, setVariables] = useState<EnvVar[]>(
    field.value ?? workspace.installation?.variables ?? []
  )

  const onClickAddVariable = useCallback(() => {
    const variable = { id: fakeId(), key: '', value: '' } as EnvVar
    const updatedVariables = [...variables, variable] as EnvVar[]

    setVariables(updatedVariables)
    helpers.setValue(updatedVariables)
  }, [variables, helpers])

  const onChangeKey = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, variable: EnvVar) => {
      const updatedVariable = variables.find(
        (t) => t.id === variable.id
      ) as EnvVar
      const variableIndex = variables.findIndex((t) => t.id === variable.id)
      updatedVariable.key = e.target.value

      const updatedVariables = [...variables]
      updatedVariables[variableIndex] = updatedVariable

      setVariables(updatedVariables)
      helpers.setValue(updatedVariables)
    },
    [variables, helpers]
  )

  const onChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, variable: EnvVar) => {
      const updatedVariable = variables.find(
        (t) => t.id === variable.id
      ) as EnvVar
      const variableIndex = variables.findIndex((t) => t.id === variable.id)
      updatedVariable.value = e.target.value

      const updatedVariables = [...variables]
      updatedVariables[variableIndex] = updatedVariable

      setVariables(updatedVariables)
      helpers.setValue(updatedVariables)
    },
    [variables, helpers]
  )

  const onClickRemoveVariable = useCallback(
    (variable: EnvVar) => {
      const updatedVariables = variables.filter((t) => t.id !== variable.id)
      setVariables(updatedVariables)
      helpers.setValue(updatedVariables)
    },
    [variables, helpers]
  )

  useEffect(() => {
    if (!field.value && !workspace.installation?.variables?.length) return

    helpers.setValue(field.value ?? workspace.installation?.variables)
  }, [field.value, workspace.installation?.variables, helpers])

  return (
    <div className="flex flex-col mt-6">
      <div className="flex">
        <div className="flex items-center gap-x-3">
          <p className="text-white font-thin">Env Variables</p>
          <Lucide
            id="installation-vars-info"
            icon="Info"
            size={16}
            color="#d2d2d2"
            strokeWidth={1}
          />
          <Tooltip
            style={{ backgroundColor: '#181818', maxWidth: '200px' }}
            anchorSelect="#installation-vars-info"
            place="bottom"
            className="flex flex-col text-center font-thin"
          >
            <span className="text-xs text-gray-100 font-thin">
              We'll copy the .env.example file present inside your project and
              replace the variables bellow with the values you provide.
            </span>
          </Tooltip>
        </div>
        <ButtonMain
          sm
          primary
          bordered
          className="ml-auto"
          onClick={onClickAddVariable}
        >
          Add variable
        </ButtonMain>
      </div>
      <div className="flex flex-col">
        {variables.map((variable) => (
          <div key={variable.id} className="grid grid-cols-12 gap-x-3 mt-3">
            <InputMain
              placeholder="Key"
              name="installation.variables[].key"
              containerClasses="col-span-4"
              value={variable.key ?? ''}
              onChange={(e) => onChangeKey(e, variable)}
            />
            <InputMain
              placeholder="Value"
              name="installation.variables[].value"
              containerClasses="col-span-7"
              value={variable.value ?? ''}
              onChange={(e) => onChangeValue(e, variable)}
            />
            <button
              type="button"
              className="col-span-1 text-white"
              onClick={() => onClickRemoveVariable(variable)}
            >
              <Lucide icon="X" size={16} color="#d2d2d2" strokeWidth={1} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
