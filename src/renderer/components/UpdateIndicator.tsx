import { UpdateDownloadedEvent } from 'electron-updater'
import React, { useCallback, useState } from 'react'

import ButtonMain from 'renderer/base-components/ButtonMain'
import ShadowMain from 'renderer/base-components/ShadowMain'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

export default function UpdateIndicator() {
  const [version, setVersion] = useState<string | null>(null)

  useIpc('update.downloaded', (info: UpdateDownloadedEvent) => {
    setVersion(info.version)
  })

  const onClickUpdate = useCallback(() => {
    return ipcRenderer.sendMessage('update.install')
  }, [])

  if (!version) {
    return null
  }

  return (
    <ShadowMain
      shadow
      wrapperClassName="rounded-[7px]"
      shadowClassName="!rounded-[7px]"
      className="rounded-[7px]"
    >
      <ButtonMain
        highlight
        bordered
        sm
        className="flex flex-col !text-[#f0f0f0]"
        onClick={onClickUpdate}
      >
        Update Available &sdot; {version}
      </ButtonMain>
    </ShadowMain>
  )
}
