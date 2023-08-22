import { useField } from 'formik'
import React from 'react'
import CheckboxMain from 'renderer/base-components/CheckboxMain'

function ModalEditWorkspaceDocker() {
  const [fieldCheckbox] = useField('enableDocker')

  return (
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto p-3">
      <CheckboxMain name="enableDocker">Enable Docker</CheckboxMain>
      <div className="flex flex-col relative flex-1">
        {!fieldCheckbox.value && (
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
            disabled
          >
            Enable Containers
          </CheckboxMain>
        </div>
      </div>
    </div>
  )
}

export default ModalEditWorkspaceDocker
