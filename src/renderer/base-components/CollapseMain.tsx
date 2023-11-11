import classNames from 'classnames'
import React, { useMemo } from 'react'
import Lucide from 'renderer/base-components/lucide'

interface CollapseMainProps {
  children?: React.ReactNode
  className?: string
  label: string
  open: boolean
  setOpen: (open: boolean) => void
}

const defaultProps = {
  children: null,
  className: '',
}

function CollapseMain(props: CollapseMainProps) {
  const { children, className: defaultClasses, label, open, setOpen } = props

  const classes = useMemo(
    () =>
      classNames({
        'flex flex-col border-b border-[#353535]': true,
        [defaultClasses!]: !!defaultClasses,
      }),
    [defaultClasses]
  )

  return (
    <div className={classes}>
      <button
        type="button"
        className="flex items-center text-left flex-1 justify-between py-2"
        onClick={() => setOpen(!open)}
      >
        <span className="font-thin text-sm text-[#d2d2d2]">{label}</span>
        <Lucide
          icon={open ? 'ChevronUp' : 'ChevronDown'}
          size={20}
          color="#fff"
        />
      </button>
      {open ? children : null}
    </div>
  )
}

CollapseMain.defaultProps = defaultProps

export default CollapseMain
