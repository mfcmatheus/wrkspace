import React from 'react'
import classNames from 'classnames'
import Lucide from 'renderer/base-components/lucide'

interface Props {
  active: boolean
  icon: string
  name: string
  count: number
  callback: () => void
}

export default function MenuMainDefault(props: Props) {
  const { callback, active, icon, name, count } = props

  return (
    <li>
      <button
        type="button"
        className={classNames({
          'cursor-default flex items-center gap-x-2 w-full py-1 px-2 rounded hover:bg-border':
            true,
          'bg-border text-white': active,
        })}
        onClick={callback}
      >
        <Lucide icon={icon} size={14} />
        <span className="font-light text-sm">{name}</span>
        {count > 0 && (
          <span className="text-[10px] ml-auto rounded bg-zinc-900 px-1">
            {count}
          </span>
        )}
      </button>
    </li>
  )
}
