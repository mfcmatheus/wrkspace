import classNames from 'classnames'
import React from 'react'

interface ButtonMainProps {
  children: React.ReactNode
  primary?: boolean
  className?: string
  onClick?: () => void
}

const defaultProps = {
  primary: false,
  className: '',
  onClick: () => {},
}

function ButtonMain(props: ButtonMainProps) {
  const { children, primary, className, onClick } = props

  const classes = classNames({
    'uppercase py-2 px-6 shadow font-thin text-sm': true,
    'text-white bg-indigo-600': primary,
  })

  return (
    <button
      type="button"
      className={[classes, className].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

ButtonMain.defaultProps = defaultProps

export default ButtonMain
