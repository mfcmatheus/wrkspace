import React, { useMemo } from 'react'
import Lucide from 'renderer/base-components/lucide'

export default function MenuMain() {
  const items = useMemo(
    () => [
      {
        id: 1,
        name: 'Dashboard',
        icon: 'LayoutGrid',
        active: false,
        count: 0,
        callback: () => {},
      },
      {
        id: 2,
        name: 'Favorites',
        icon: 'Star',
        active: false,
        count: 14,
        callback: () => {},
      },
      {
        id: 3,
        name: 'Most used',
        icon: 'TrendingUp',
        active: false,
        count: 0,
        callback: () => {},
      },
      {
        id: 4,
        name: 'Never used',
        icon: 'File',
        active: false,
        count: 0,
        callback: () => {},
      },
      {
        id: 5,
        name: 'Not installed',
        icon: 'Cloud',
        active: false,
        count: 0,
        callback: () => {},
      },
      {
        id: 6,
        name: 'Archived',
        icon: 'Archive',
        active: false,
        count: 0,
        callback: () => {},
      },
    ],
    []
  )

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.id} className="w-full">
          <button
            type="button"
            className="flex items-center gap-x-2 w-full py-1 px-2 rounded hover:bg-border transition ease-in-out duration-200"
          >
            <Lucide icon={item.icon} size={14} />
            <span className="font-light text-sm">{item.name}</span>
            {item.count > 0 && (
              <span className="text-[10px] ml-auto rounded bg-zinc-900 px-1">
                {item.count}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
