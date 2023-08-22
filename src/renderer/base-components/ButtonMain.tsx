import classNames from 'classnames'
import React from 'react'

interface ButtonMainProps {
  children: React.ReactNode
  primary?: boolean
  danger?: boolean
  sm?: boolean
  bordered?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick?: () => void
}

const defaultProps = {
  primary: false,
  danger: false,
  sm: false,
  bordered: false,
  className: '',
  type: 'button',
  onClick: () => {},
}

function ButtonMain(props: ButtonMainProps) {
  const { children, primary, danger, className, onClick, type, sm, bordered } =
    props

  const classes = classNames({
    'uppercase shadow font-thin': true,
    'py-2 px-6 text-sm': !sm,
    'py-1 px-3 text-xs': sm,
    'text-white bg-indigo-600': !bordered && primary,
    'text-white bg-red-600': !bordered && danger,
    'text-indigo-600 border border-indigo-600': bordered && primary,
    'text-red-600 border border-red-600': bordered && danger,
  })

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={[classes, className].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

ButtonMain.defaultProps = defaultProps

export default ButtonMain
