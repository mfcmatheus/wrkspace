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
        <div className="flex items-center gap-x-3">
          <p className="text-white font-thin">Terminal commands</p>
          <Lucide
            id="pages-info"
            icon="Info"
            size={16}
            color="#d2d2d2"
            strokeWidth={1}
          />
          <Tooltip
            style={{ backgroundColor: '#181818', maxWidth: '200px' }}
            anchorSelect="#pages-info"
            place="bottom"
            className="flex flex-col text-center font-thin"
          >
            <span className="text-xs text-gray-100 font-thin">
              Create the terminal commands that will be executed when the
              workspace is opened.
            </span>
          </Tooltip>
        </div>
        <ButtonMain
          sm
          bordered
          primary
          className="ml-auto"
          onClick={onClickAddTerminal}
        >
          New terminal
        </ButtonMain>
      </div>
      <div className="flex flex-col gap-y-3">
        {terminals.map((terminal: Terminal, index: number) => (
          <div key={terminal.id} className="flex">
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
            <button
              type="button"
              className="px-4 text-white"
              onClick={() => onClickRemoveTerminal(terminal)}
            >
              <Lucide icon="X" size={16} color="#d2d2d2" strokeWidth={1} />
            </button>
          </div>
        ))}
      </div>
      <ErrorMessage name="terminals" render={renderError} />
    </div>
  )
}

export default ModalEditWorkspaceTerminal
