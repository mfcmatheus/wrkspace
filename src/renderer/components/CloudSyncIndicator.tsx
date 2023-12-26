import React from 'react'
import { Tooltip } from 'react-tooltip'
import LoadingIcon from 'renderer/base-components/LoadingIcon'

import Lucide from 'renderer/base-components/lucide'
import { useCloudSync } from 'renderer/contexts/CloudSyncContext'
import { useUser } from 'renderer/contexts/UserContext'
import useNetwork from 'renderer/hooks/useNetwork'

function CloudSyncIndicator() {
  const { isOnline } = useNetwork()
  const { hasCloudSync, gettingUser } = useUser()
  const { isSyncing } = useCloudSync()

  if (!hasCloudSync || gettingUser) return null

  if (isSyncing) {
    return <LoadingIcon icon="oval" color="#f0f0f0" />
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
        <span className="text-xs">Updated: 12:32</span>
      </Tooltip>
    </div>
  )
}

export default CloudSyncIndicator
