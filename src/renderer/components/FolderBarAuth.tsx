import React, { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import LoadingIcon from 'renderer/base-components/LoadingIcon'
import Lucide from 'renderer/base-components/lucide'
import { useUser } from 'renderer/contexts/UserContext'
import { ipcRenderer } from 'renderer/hooks/useIpc'

export default function FolderBarAuth() {
  const { user, resetUser, gettingUser } = useUser()

  const onClickAccount = useCallback(() => {
    ipcRenderer.sendMessage('user.authenticate')
  }, [])

  const onClickLogout = useCallback(() => {
    ipcRenderer.sendMessage('user.logout')
    localStorage.removeItem('token')
    resetUser()
  }, [resetUser])

  const tooltipLogged = () => (
    <div className="flex flex-col text-center">
      <span className="font-thin text-sm">You're logged as</span>
      <span>{user?.name}</span>
      <button
        type="button"
        className="text-primary mt-1 font-thin"
        onClick={onClickLogout}
      >
        Log out
      </button>
    </div>
  )

  const tooltipGuest = () => (
    <button
      type="button"
      className="text-primary mt-1 font-thin"
      onClick={onClickAccount}
    >
      Sign in
    </button>
  )

  return (
    <>
      <button
        id="auth-button"
        type="button"
        className="flex h-12 w-12 justify-center items-center"
        onClick={() => !user && onClickAccount()}
      >
        {gettingUser ? (
          <LoadingIcon icon="oval" color="#f0f0f0" />
        ) : (
          <Lucide
            icon="UserCircle2"
            size={32}
            color="#6f6f6f"
            strokeWidth={1}
          />
        )}
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
