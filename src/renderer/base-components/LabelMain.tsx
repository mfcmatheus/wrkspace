import classNames from 'classnames'
import React, { useMemo } from 'react'

interface LabelMainProps {
  htmlFor: string
  children: React.ReactNode
  className?: string
}

function LabelMain(props: LabelMainProps) {
  const { htmlFor, children, className } = props

  const classes = useMemo(
    () =>
      classNames({
        'text-[13px] text-[#a1a1a1] mb-2': true,
        [className!]: !!className,
      }),
    [className]
  )

  return (
    <label className={classes} htmlFor={htmlFor}>
      {children}
    </label>
  )
}

export default LabelMain
