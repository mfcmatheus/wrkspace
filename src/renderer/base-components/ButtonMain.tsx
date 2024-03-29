import classNames from 'classnames'
import React, { useMemo } from 'react'

interface ButtonMainProps {
  children: React.ReactNode
  primary?: boolean
  secondary?: boolean
  highlight?: boolean
  disabled?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  bordered?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick?: () => void
}

const defaultProps = {
  primary: false,
  secondary: false,
  highlight: false,
  disabled: false,
  sm: false,
  md: false,
  lg: false,
  bordered: false,
  className: '',
  type: 'button',
  onClick: () => {},
}

function ButtonMain(props: ButtonMainProps) {
  const {
    children,
    primary,
    secondary,
    highlight,
    disabled,
    className,
    onClick,
    type,
    sm,
    md,
    lg,
    bordered,
  } = props

  const classes = useMemo(
    () =>
      classNames({
        'flex items-center justify-center gap-x-3 rounded-[6px] transition-all ease-in-out duration-200 disabled:cursor-not-allowed':
          true,
        'px-[12px] py-[6px]': sm,
        'px-[24px] py-[12px] text-lg': md,
        'px-[36px] py-[18px] text-xl': lg,
        'bg-white text-black hover:bg-gray-300 disabled:bg-[#1a1a1a] disabled:text-[#8f8f8f] disabled:shadow-[0_0_0_1px_hsla(0,0%,18%,1)]':
          secondary,
        'shadow-[0_0_0_1px_hsla(0,0%,100%,.14)] text-white hover:bg-[hsla(0,0%,100%,.14)] disabled:hover:bg-transparent':
          bordered && primary,
        'text-white hover:bg-gradient-to-r from-highlight-primary to-highlight-secondary':
          highlight,
        [className!]: !!className,
      }),
    [sm, md, lg, bordered, primary, secondary, className, highlight]
  )

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={[classes, className].join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

ButtonMain.defaultProps = defaultProps

export default ButtonMain
