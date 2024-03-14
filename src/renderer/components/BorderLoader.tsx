import classNames from 'classnames'
import React, { useMemo } from 'react'

interface Props {
  children: React.ReactNode
  wrapperClassName?: string
  className?: string
}

function BorderLoader(props: Props) {
  const { children, wrapperClassName, className } = props

  const wrapperClasses = useMemo(
    () =>
      classNames({
        'relative  p-[1px] overflow-hidden': true,
        '': true,
        [wrapperClassName!]: !!wrapperClassName,
      }),
    [wrapperClassName]
  )

  const borderClasses = useMemo(
    () =>
      classNames({
        'flex absolute h-[150%] w-[150%] m-[-1px] top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] rounded-full z-[-1]':
          true,
        [className!]: !!className,
      }),
    [className]
  )

  const classes = useMemo(
    () =>
      classNames({
        'bg-[#202020]': true,
        [className!]: !!className,
      }),
    [className]
  )

  return (
    <div className={wrapperClasses}>
      <div className={classes}>{children}</div>
      <div className={borderClasses}>
        <div
          className="h-full w-full motion-safe:animate-spin-slow"
          style={{
            background:
              'conic-gradient(#202020, #202020, #202020, oklch(59.59% 0.24 255.09156059071347), oklch(81.58% 0.189 190.74037768509325))',
          }}
        />
      </div>
    </div>
  )
}

export default BorderLoader
