import React, { useEffect, useState } from 'react'
import { useField, useFormikContext } from 'formik'

import classNames from 'classnames'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Lucide from 'renderer/base-components/lucide'
import SwitchMain from 'renderer/base-components/SwitchMain'

function ModalEditWorkspaceDocker() {
  const { setFieldValue } = useFormikContext()
  const [fieldCheckbox] = useField('features.enableDocker')
  const [fieldUseSail] = useField('docker.enableSail')
  const [fieldUseBuild] = useField('docker.enableBuild')

  const [isDockerRunning, setIsDockerRunning] = useState<boolean>(false)

  useEffect(() => {
    ipcRenderer.sendMessage('services.docker')
  }, [])

  useIpc('services.docker', (status: boolean) => {
    setIsDockerRunning(status)
  })

  return (
    <div className="flex flex-col gap-y-8 flex-grow basis-0 overflow-auto p-[1px]">
      <div className="flex gap-x-3">
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-white">Docker integration</p>
          <span className="text-sm text-zinc-400 font-thin">
            Connect your workspace with Docker to deploy your applications.
          </span>
        </div>
        <div className="flex items-center text-[#d2d2d2] text-xs gap-x-1 font-thin ml-auto">
          <div
            className={classNames({
              'h-2 w-2 rounded-full bg-red-600': true,
              '!bg-green-600': isDockerRunning,
            })}
          />
          <span>Docker status:</span>
          <span>{isDockerRunning ? 'Running' : 'Stopped'}</span>
        </div>
      </div>
      <div className="flex flex-col border border-border rounded-md p-4 gap-y-6">
        <span className="text-white">Activate integration</span>
        <p className="text-sm font-light">
          Activating docker integration will allow you to deploy multiple
          containers at same time when you launch your workspace.
        </p>

        <div className="flex gap-x-2 items-center">
          <SwitchMain
            sm
            primary
            name="features.enableDocker"
            id="enableEditor"
            onChange={(e) => {
              setFieldValue('features.enableDocker', e.target.checked)
              setFieldValue('docker.enableComposer', e.target.checked)
            }}
          />
          <span className="text-sm font-light">
            {fieldCheckbox.value ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="flex items-center -mx-4 -mb-4 border-t border-border py-3 px-4">
          <div className="flex items-center gap-x-2">
            <Lucide icon="Info" size={16} color="#d2d2d2" />
            <span className="text-xs font-light">
              Your application needs to have a structured docker-compose file in
              the root directory to be deployed.
            </span>
          </div>
        </div>
      </div>

      {fieldCheckbox.value && (
        <div className="flex flex-col border border-border rounded-md p-4 gap-y-6">
          <div className="flex items-center -mx-4 -mt-4 border-b border-border py-3 px-4">
            <span className="text-white">Options</span>
          </div>
          <div className="flex flex-col gap-y-4 border-b border-border pb-6">
            <span className="text-white">Use Laravel Sail</span>
            <p className="text-sm font-light">
              Activating Laravel Sail support we'll start your containers
              running 'sail up' command instead of classic 'docker-compose up'
              command.
            </p>
            <div className="flex gap-x-2 items-center">
              <SwitchMain sm primary name="docker.enableSail" id="enableSail" />
              <span className="text-sm font-light">
                {fieldUseSail.value ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <span className="text-white">Rebuild image</span>
            <p className="text-sm font-light">
              Activating this option will rebuild the image of your container
              when you start your workspace.
            </p>
            <div className="flex gap-x-2 items-center">
              <SwitchMain
                sm
                primary
                name="docker.enableBuild"
                id="enableBuild"
              />
              <span className="text-sm font-light">
                {fieldUseBuild.value ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModalEditWorkspaceDocker
