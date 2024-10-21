import React, { useCallback, useEffect, useState } from 'react'
import { ErrorMessage, useField, useFormikContext } from 'formik'

import classNames from 'classnames'
import { Tooltip } from 'react-tooltip'
import Terminal from 'renderer/@types/Terminal'
import Workspace from 'renderer/@types/Workspace'

import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import fakeId from 'renderer/helpers/fakeId'
import Lucide from 'renderer/base-components/lucide'

interface ModalEditWorkspaceTerminalProps {
  workspace: Workspace
}

function ModalEditWorkspaceTerminal(props: ModalEditWorkspaceTerminalProps) {
  const { workspace } = props

  const { errors } = useFormikContext()
  const [field, meta, helpers] = useField('terminals')

  const [command, setCommand] = useState<string>('')
  const [terminals, setTerminals] = useState<Terminal[]>(
    field.value ?? workspace?.terminals ?? []
  )

  const onClickAddTerminal = useCallback(() => {
    const terminal = { id: fakeId(), command: '' } as Terminal
    const updatedTerminals = [...terminals, terminal] as Terminal[]

    setTerminals(updatedTerminals)
    helpers.setValue(updatedTerminals)
  }, [terminals, helpers])

  const onClickRemoveTerminal = useCallback(
    (terminal: Terminal) => {
      const updatedTerminals = terminals.filter((t) => t.id !== terminal.id)
      setTerminals(updatedTerminals)
      helpers.setValue(updatedTerminals)
    },
    [terminals, helpers]
  )

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  const onChangeCommand = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, terminal: Terminal) => {
      const updatedTerminal = terminals.find(
        (t) => t.id === terminal.id
      ) as Terminal
      const newData = { ...updatedTerminal }
      const terminalIndex = terminals.findIndex((t) => t.id === terminal.id)
      newData.command = e.target.value

      const updatedTerminals = [...terminals]
      updatedTerminals[terminalIndex] = newData

      setTerminals(updatedTerminals)
      helpers.setValue(updatedTerminals)
    },
    [terminals, helpers]
  )

  useEffect(() => {
    if (!field.value && !workspace?.terminals?.length) return

    helpers.setValue(field.value ?? workspace?.terminals)
  }, [field.value, workspace?.terminals, helpers])

  return (
    <div className="flex flex-col gap-y-8 flex-grow basis-0 overflow-auto p-[1px]">
      <div className="flex flex-col gap-y-1">
        <p className="text-white">Terminal commands</p>
        <span className="text-sm text-zinc-400 font-thin">
          Create the terminal commands that will be executed when the workspace
          is opened.
        </span>
      </div>
      <div className="flex flex-col border border-border rounded-md p-4 gap-y-6">
        <p className="text-white">Add a new terminal command</p>
        <label className="flex flex-col gap-y-2">
          <span className="text-sm font-light">Command</span>
          <InputMain
            standard
            placeholder="Ex: yarn dev"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
        </label>
        <div className="flex items-center -mx-4 -mb-4 border-t border-border py-2 px-4">
          <ButtonMain
            secondary
            bordered
            sm
            onClick={onClickAddTerminal}
            disabled={!command}
            className="ml-auto"
          >
            Save
          </ButtonMain>
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        {terminals.map((terminal: Terminal, index: number) => (
          <div key={terminal.id} className="flex gap-x-3">
            <InputMain
              containerClasses={classNames({
                'border border-red-500': errors.terminals?.[index]?.command,
              })}
              placeholder="Command"
              name={`terminals[${index}].command`}
              value={terminal.command ?? ''}
              onChange={(e) => onChangeCommand(e, terminal)}
              onBlur={() => {}}
            />
            <ButtonMain
              bordered
              primary
              sm
              onClick={() => onClickRemoveTerminal(terminal)}
            >
              <Lucide icon="CircleMinus" size={20} color="#d2d2d2" />
            </ButtonMain>
          </div>
        ))}
      </div>
      <ErrorMessage name="terminals" render={renderError} />
    </div>
  )
}

export default ModalEditWorkspaceTerminal
