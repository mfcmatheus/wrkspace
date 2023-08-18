import classNames from 'classnames'
import React from 'react'

interface ButtonMainProps {
  children: React.ReactNode
  primary?: boolean
  danger?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick?: () => void
}

const defaultProps = {
  primary: false,
  danger: false,
  className: '',
  type: 'button',
  onClick: () => {},
}

function ButtonMain(props: ButtonMainProps) {
  const { children, primary, danger, className, onClick, type } = props

  const classes = classNames({
    'uppercase py-2 px-6 shadow font-thin text-sm': true,
    'text-white bg-indigo-600': primary,
    'text-red-600 border border-red-600': danger,
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
