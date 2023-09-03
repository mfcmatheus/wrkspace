import React, { useEffect, useState } from 'react'
import { useField } from 'formik'

import classNames from 'classnames'
import CheckboxMain from 'renderer/base-components/CheckboxMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Container from 'renderer/@types/Container'
import Lucide from 'renderer/base-components/lucide'

function ModalEditWorkspaceDocker() {
  const [fieldContainers, metaContainers, helpersContainers] =
    useField('containers')
  const [fieldCheckbox] = useField('enableDocker')
  const [fieldCheckboxContainers] = useField('enableDockerContainers')

  const [containers, setContainers] = useState<Container[]>([])
  const [isDockerRunning, setIsDockerRunning] = useState<boolean>(false)

  const onSelectContainer = (
    e: React.ChangeEvent<HTMLInputElement>,
    container: Container
  ) => {
    if (e.target.checked) {
      helpersContainers.setValue([
        ...(fieldContainers.value ?? []),
        container.ID,
      ])
    } else {
      helpersContainers.setValue(
        fieldContainers.value?.filter((item: string) => item !== container.ID)
      )
    }
  }

  const isSelectedContainer = (container: Container) => {
    return (
      fieldContainers.value?.findIndex(
        (item: string) => item === container.ID
      ) > -1
    )
  }

  useEffect(() => {
    ipcRenderer.sendMessage('containers.get')
  }, [fieldCheckboxContainers.value])

  useEffect(() => {
    ipcRenderer.sendMessage('services.docker')
  }, [])

  useIpc('containers.get', (data: string) => {
    const dataParsed = data
      .split('\n')
      .filter((item: string) => item !== '')
      .map((item) => JSON.parse(item))

    setContainers(dataParsed as Container[])
  })

  useIpc('services.docker', (status: boolean) => {
    setIsDockerRunning(status)
  })

  return (
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto p-3">
      <div className="flex items-center">
        <CheckboxMain name="enableDocker">Enable Docker</CheckboxMain>

        <div className="flex items-center text-[#d2d2d2] text-xs gap-x-1 font-thin ml-auto">
          <div
            className={classNames({
              'h-2 w-2 rounded-full bg-red-600': true,
              '!bg-green-600': isDockerRunning,
            })}
          />
          <span>Service status:</span>
          <span>{isDockerRunning ? 'Running' : 'Stopped'}</span>
        </div>
      </div>
      <div className="flex flex-col relative flex-1">
        {(!fieldCheckbox.value || !isDockerRunning) && (
          <div className="absolute inset-0 bg-[#202020] opacity-75 z-[2]" />
        )}
        <div className="mt-4 flex w-3/4 mx-auto gap-x-1 relative z-[1]">
          <CheckboxMain
            as="button"
            primary
            name="enableDockerCompose"
            className="w-full"
          >
            Enable Composer
          </CheckboxMain>
          <CheckboxMain
            as="button"
            primary
            name="enableDockerContainers"
            className="w-full"
          >
            Enable Containers
          </CheckboxMain>
        </div>
        {fieldCheckboxContainers.value && (
          <div className="flex flex-col gap-y-2 mt-6">
            {containers &&
              containers.map((container: Container) => (
                <div
                  key={container.ID}
                  className="flex items-center gap-x-3 border-b border-[#353535] last:border-none pb-2"
                >
                  <Lucide icon="Container" color="#d2d2d2" />
                  <div className="flex flex-col flex-1 font-thin leading-none">
                    <span className="text-white">{container.Names}</span>
                    <span className="text-[#d2d2d2] text-xs">
                      {container.ID}
                    </span>
                  </div>
                  <CheckboxMain
                    sm
                    as="button"
                    primary
                    name="containers[]"
                    labelClassName="px-4"
                    value={container.ID}
                    checked={isSelectedContainer(container)}
                    onChange={(e) => onSelectContainer(e, container)}
                  >
                    Select
                  </CheckboxMain>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModalEditWorkspaceDocker
