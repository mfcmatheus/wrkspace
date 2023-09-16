import React, { useCallback, useEffect, useState } from 'react'
import { ErrorMessage, useField } from 'formik'

import Terminal from 'renderer/@types/Terminal'
import Workspace from 'renderer/@types/Workspace'

import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import fakeId from 'renderer/helpers/fakeId'

interface ModalEditWorkspaceTerminalProps {
  workspace: Workspace
}

function ModalEditWorkspaceTerminal(props: ModalEditWorkspaceTerminalProps) {
  const { workspace } = props

  const [field, meta, helpers] = useField('terminals')

  const [terminals, setTerminals] = useState<Terminal[]>(
    field.value ?? workspace.terminals ?? []
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
      const terminalIndex = terminals.findIndex((t) => t.id === terminal.id)
      updatedTerminal.command = e.target.value

      const updatedTerminals = [...terminals]
      updatedTerminals[terminalIndex] = updatedTerminal

      setTerminals(updatedTerminals)
      helpers.setValue(updatedTerminals)
    },
    [terminals, helpers]
  )

  useEffect(() => {
    if (!field.value && !workspace.terminals?.length) return

    helpers.setValue(field.value ?? workspace.terminals)
  }, [field.value, workspace.terminals, helpers])

  return (
    <div className="flex flex-col gap-y-5 flex-grow basis-0 overflow-auto p-3">
      <div className="flex">
        <ButtonMain
          className="text-white border border-indigo-600 !text-xs ml-auto"
          onClick={onClickAddTerminal}
        >
          New terminal
        </ButtonMain>
      </div>
      {terminals.map((terminal: Terminal) => (
        <div key={terminal.id} className="bg-[#353535] p-5">
          <div className="flex flex-col gap-y-3">
            <div className="flex">
              <InputMain
                className="w-11/12"
                placeholder="Command"
                name="terminals[].command"
                value={terminal.command ?? ''}
                onChange={(e) => onChangeCommand(e, terminal)}
                onBlur={() => {}}
              />
            </div>
          </div>
          <div className="flex">
            <ButtonMain
              sm
              danger
              bordered
              className="mt-3"
              onClick={() => onClickRemoveTerminal(terminal)}
            >
              Remove terminal
            </ButtonMain>
          </div>
        </div>
      ))}
      <ErrorMessage name="terminals" render={renderError} />
    </div>
  )
}

export default ModalEditWorkspaceTerminal
