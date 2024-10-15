import React from 'react'
import Lucide from 'renderer/base-components/lucide'

export default function ActionsMain() {
  return (
    <ul className="mt-auto">
      <li>
        <button
          type="button"
          className="flex items-center gap-x-2 w-full py-1 px-2 rounded text-[#d2d2d2] hover:bg-border transition ease-in-out duration-200"
        >
          <Lucide icon="Cog" size={14} />
          <span className="font-light text-sm">Settings</span>
        </button>
      </li>
    </ul>
  )
}
