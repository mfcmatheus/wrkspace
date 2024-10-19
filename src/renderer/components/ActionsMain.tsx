import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Lucide from 'renderer/base-components/lucide'
import UpdateIndicator from './UpdateIndicator'

export default function ActionsMain() {
  const navigate = useNavigate()

  const onClickSettings = useCallback(() => {
    return navigate('/settings')
  }, [navigate])

  return (
    <ul className="flex flex-col gap-y-3 mt-auto">
      <li>
        <UpdateIndicator />
      </li>
      <li>
        <button
          type="button"
          className="cursor-default flex items-center gap-x-2 w-full py-1 px-2 rounded text-[#d2d2d2] hover:bg-border transition ease-in-out duration-200"
          onClick={onClickSettings}
        >
          <Lucide icon="Cog" size={14} />
          <span className="font-light text-sm">Settings</span>
        </button>
      </li>
    </ul>
  )
}
