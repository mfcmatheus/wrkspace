import classNames from 'classnames'
import React, { useMemo } from 'react'
import Lucide from 'renderer/base-components/lucide'

interface LogMainTabsItemProps {
  children: React.ReactNode
  current?: boolean
  onSelect?: () => void
  onClose?: () => void
}

const defaultProps = {
  current: false,
  onSelect: () => {},
  onClose: () => {},
}

function LogMainTabsItem(props: LogMainTabsItemProps) {
  const { children, current, onSelect, onClose } = props

  const classes = useMemo(
    () =>
      classNames({
        'flex gap-x-3 items-center max-w-[150px] py-[2px] px-2 border border-border rounded select-none':
          true,
        'bg-border': current,
      }),
    [current]
  )

  return (
    <div className={classes}>
      <button
        type="button"
        className="cursor-default text-sm font-thin text-[#d2d2d2] flex-1 whitespace-nowrap text-ellipsis"
        onClick={() => onSelect?.()}
      >
        {children}
      </button>
      <button
        type="button"
        className="cursor-default"
        onClick={() => onClose?.()}
      >
        <Lucide icon="X" size={16} color="#6f6f6f" />
      </button>
    </div>
  )
}

LogMainTabsItem.defaultProps = defaultProps

export default LogMainTabsItem
