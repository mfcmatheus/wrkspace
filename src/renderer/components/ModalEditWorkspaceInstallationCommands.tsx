import { useField } from 'formik'
import React, { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import Command from 'renderer/@types/Command'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import fakeId from 'renderer/helpers/fakeId'

interface ModalEditWorkspaceInstallationCommandsProps {
  workspace: Workspace
}

export default function ModalEditWorkspaceInstallationCommands(
  props: ModalEditWorkspaceInstallationCommandsProps
) {
  const { workspace } = props

  const [field, meta, helpers] = useField('installation.commands')
  const [commands, setCommands] = useState<Command[]>(
    field.value ?? workspace.installation?.commands ?? []
  )

  const onClickAddCommand = useCallback(() => {
    const command = { id: fakeId(), command: '' } as Command
    const updatedCommands = [...commands, command] as Command[]

    setCommands(updatedCommands)
    helpers.setValue(updatedCommands)
  }, [commands, helpers])

  const onChangeCommand = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, command: Command) => {
      const updatedCommand = commands.find(
        (t) => t.id === command.id
      ) as Command
      const commandIndex = commands.findIndex((t) => t.id === command.id)
      updatedCommand.command = e.target.value

      const updatedCommands = [...commands]
      updatedCommands[commandIndex] = updatedCommand

      setCommands(updatedCommands)
      helpers.setValue(updatedCommands)
    },
    [commands, helpers]
  )

  const onClickRemoveCommand = useCallback(
    (command: Command) => {
      const updatedCommands = commands.filter((t) => t.id !== command.id)
      setCommands(updatedCommands)
      helpers.setValue(updatedCommands)
    },
    [commands, helpers]
  )

  return (
    <div className="flex flex-col mt-6">
      <div className="flex">
        <div className="flex items-center gap-x-3">
          <p className="text-white font-thin">Commands</p>
          <Lucide
            id="installation-commands-info"
            icon="Info"
            size={16}
            color="#d2d2d2"
            strokeWidth={1}
          />
          <Tooltip
            style={{ backgroundColor: '#181818', maxWidth: '200px' }}
            anchorSelect="#installation-commands-info"
            place="bottom"
            className="flex flex-col text-center font-thin"
          >
            <span className="text-xs text-gray-100 font-thin">
              Create the commands used to install your project like the Node
              dependencies, Composer, Docker containers, etc.
            </span>
          </Tooltip>
        </div>
        <ButtonMain
          sm
          primary
          bordered
          className="ml-auto"
          onClick={onClickAddCommand}
        >
          Add command
        </ButtonMain>
      </div>
      <div className="flex flex-col">
        {commands.map((command) => (
          <div key={command.id} className="grid grid-cols-12 gap-x-3 mt-3">
            <InputMain
              placeholder="Command"
              name="installation.commands[].command"
              containerClasses="col-span-11"
              value={command.command ?? ''}
              onChange={(e) => onChangeCommand(e, command)}
            />
            <button
              type="button"
              className="col-span-1 text-white"
              onClick={() => onClickRemoveCommand(command)}
            >
              <Lucide icon="X" size={16} color="#d2d2d2" strokeWidth={1} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
