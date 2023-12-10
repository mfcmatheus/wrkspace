import React, { useCallback, useContext } from 'react'
import { Tooltip } from 'react-tooltip'
import Lucide from 'renderer/base-components/lucide'
import { UserContext } from 'renderer/contexts/UserContext'
import { ipcRenderer } from 'renderer/hooks/useIpc'

export default function FolderBarAuth() {
  const { user } = useContext(UserContext)

  const onClickAccount = useCallback(() => {
    ipcRenderer.sendMessage('user.authenticate')
  }, [])

  const tooltipLogged = () => (
    <div className="flex flex-col text-center">
      <span className="font-thin text-sm">You're logged as</span>
      <span>{user?.name}</span>
      <a href="#" className="text-primary mt-1 font-thin">
        Log out
      </a>
    </div>
  )

  const tooltipGuest = () => (
    <a href="#" className="text-primary mt-1 font-thin">
      Sign in
    </a>
  )

  return (
    <>
      <button
        id="auth-button"
        type="button"
        className="flex h-12 w-12 justify-center items-center"
        onClick={onClickAccount}
      >
        <Lucide icon="UserCircle2" size={32} color="#6f6f6f" strokeWidth={1} />
      </button>

      <Tooltip
        style={{ backgroundColor: '#181818' }}
        anchorSelect="#auth-button"
        place="left"
        clickable
      >
        {user ? tooltipLogged() : tooltipGuest()}
      </Tooltip>
    </>
  )
}
