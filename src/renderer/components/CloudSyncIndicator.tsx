import React, { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ButtonMain from 'renderer/base-components/ButtonMain'
import LoadingIcon from 'renderer/base-components/LoadingIcon'

import Lucide from 'renderer/base-components/lucide'
import { useCloudSync } from 'renderer/contexts/CloudSyncContext'
import { useUser } from 'renderer/contexts/UserContext'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import useNetwork from 'renderer/hooks/useNetwork'

function CloudSyncIndicator() {
  const { isOnline } = useNetwork()
  const { hasCloudSync, gettingUser, user } = useUser()
  const { isSyncing, lastSync } = useCloudSync()

  const onClickUpgrade = useCallback(() => {
    ipcRenderer.sendMessage('user.upgrade')
  }, [])

  if (gettingUser || !user) return null

  if (isSyncing) {
    return <LoadingIcon icon="oval" color="#f0f0f0" />
  }

  if (user && !hasCloudSync) {
    return (
      <div>
        <Lucide
          id="account-free"
          icon="CloudOff"
          size={24}
          color="#d2d2d2"
        />
        <Tooltip
          clickable
          style={{ backgroundColor: '#181818' }}
          anchorSelect="#account-free"
          place="bottom"
          className="flex flex-col text-center font-thin"
        >
          <span>Cloud-sync is disabled</span>
          <ButtonMain
            sm
            bordered
            secondary
            className="mt-3"
            onClick={onClickUpgrade}
          >
            <span className="mx-auto">Upgrade plan</span>
          </ButtonMain>
        </Tooltip>
      </div>
    )
  }

  if (!isOnline)
    return (
      <div>
        <Lucide
          id="cloud-sync-offline"
          icon="CloudOff"
          size={24}
          color="#d2d2d2"
        />
        <Tooltip
          style={{ backgroundColor: '#181818' }}
          anchorSelect="#cloud-sync-offline"
          place="bottom"
          className="flex flex-col text-center font-thin"
        >
          <span>You're offline</span>
          <span>Cloud-sync is disabled</span>
        </Tooltip>
      </div>
    )

  return (
    <div>
      <Lucide id="cloud-sync" icon="Cloud" size={24} color="#d2d2d2" />
      <Tooltip
        style={{ backgroundColor: '#181818' }}
        anchorSelect="#cloud-sync"
        place="bottom"
        className="flex flex-col text-center font-thin"
      >
        <span>Cloud sync</span>
        <span className="text-xs">Updated: {lastSync?.format('HH:mm')}</span>
      </Tooltip>
    </div>
  )
}

export default CloudSyncIndicator
