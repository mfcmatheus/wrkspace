import classNames from 'classnames'
import React, { useMemo } from 'react'

interface Props {
  children: React.ReactNode
  wrapperClassName?: string
  shadowClassName?: string
  className?: string
  shadow?: boolean
}

function ShadowMain(props: Props) {
  const { children, wrapperClassName, shadowClassName, shadow, className } =
    props

  const wrapperClasses = useMemo(
    () =>
      classNames({
        relative: true,
        [wrapperClassName!]: !!wrapperClassName,
      }),
    [wrapperClassName]
  )

  const shadowCLasses = useMemo(
    () =>
      classNames({
        'bg-gradient-to-r from-highlight-primary to-highlight-secondary absolute w-full h-full inset-0 z-[1] rounded-[12px]':
          true,
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-highlight-primary before:to-highlight-secondary before:blur-[36px] before:content-[''] before:bg-clip-padding before:border-[12px] before:border-transparent":
          shadow,
        [shadowClassName!]: !!shadowClassName,
      }),
    [shadowClassName, shadow]
  )

  const classes = useMemo(
    () =>
      classNames({
        'relative z-[2] bg-[#202020] bg-clip-padding border border-transparent shadow-[0_0_0_1px_rgb(255,255,255,.07),0_2px_4px_rgb(255,255,255,.05),0_12px_24px_rgb(255,255,255,.05)]':
          true,
        [className!]: !!className,
      }),
    [className]
  )

  return (
    <div className={wrapperClasses}>
      <span className={shadowCLasses} />
      <div className={classes}>{children}</div>
    </div>
  )
}

export default ShadowMain
