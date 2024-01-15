import React, { useCallback, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import classNames from 'classnames'

import { Button as ButtonMain } from 'renderer/base-components/ui/button'
import InputMain from 'renderer/base-components/InputMain'
import Docker from 'renderer/svg/Docker'
import Git from 'renderer/svg/Git'
import TitleMain from 'renderer/base-components/TitleMain'
import SubtitleMain from 'renderer/base-components/SubtitleMain'
import { useIpc, ipcRenderer } from 'renderer/hooks/useIpc'

export default function ModalStartSettings() {
  const { errors, setFieldValue, isValid } = useFormikContext()

  const [isDockerInstalled, setIsDockerInstalled] = useState<boolean>(false)
  const [isGitInstalled, setIsGitInstalled] = useState<boolean>(false)

  const onClickSearch = useCallback(() => {
    ipcRenderer.sendMessage('dialog:openDirectory')
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      ipcRenderer.sendMessage('services.docker')
      ipcRenderer.sendMessage('services.git')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useIpc('dialog:openDirectory', (path: string) =>
    setFieldValue('defaultPath', path)
  )
  useIpc('services.docker', (data: boolean) => setIsDockerInstalled(!!data))
  useIpc('services.git', (data: boolean) => setIsGitInstalled(!!data))

  return (
    <div className="flex flex-col p-10">
      <TitleMain className="!text-[1.5rem] !font-medium text-white mb-6">
        Application settings
      </TitleMain>
      <label htmlFor="path" className="flex flex-col pb-6 mb-6">
        <span className="text-white font-thin mb-2">
          Default application path
        </span>
        <div className="flex">
          <InputMain
            name="defaultPath"
            id="defaultPath"
            placeholder="Default path"
            containerClasses={classNames({
              '!rounded-r-none': true,
              'border border-red-500': errors?.defaultPath,
            })}
            readOnly
          />
          <ButtonMain
            className="px-6 font-light rounded-l-none !h-11"
            onClick={onClickSearch}
          >
            Choose
          </ButtonMain>
        </div>
      </label>
      <div className="flex gap-x-16 items-center">
        <div className="flex flex-col flex-1 text-white">
          <TitleMain className="!text-[1.5rem] !font-medium">
            Required services
          </TitleMain>
          <SubtitleMain className="!text-[1.15rem] mt-3">
            Please make sure that all required services are installed,
            authenticated and running
          </SubtitleMain>
        </div>
        <div className="flex flex-col items-center text-white">
          <Docker fill="#d2d2d2" className="w-[60px] h-[60px] mb-2" />
          <span>Docker Desktop</span>
          <SubtitleMain className="!text-[1rem]">
            {isDockerInstalled ? 'Installed' : 'Not installed'}
          </SubtitleMain>
        </div>
        <div className="flex flex-col items-center text-white">
          <Git fill="#d2d2d2" className="w-[60px] h-[60px] mb-2" />
          <span>GIT</span>
          <SubtitleMain className="!text-[1rem]">
            {isGitInstalled ? 'Installed' : 'Not installed'}
          </SubtitleMain>
        </div>
      </div>
      <ButtonMain
        className="font-light mx-auto mt-10"
        disabled={!isValid || !isDockerInstalled || !isGitInstalled}
      >
        Start using wrkspace
      </ButtonMain>
    </div>
  )
}
