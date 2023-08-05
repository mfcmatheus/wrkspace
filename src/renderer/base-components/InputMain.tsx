import React, { JSX } from 'react'
import classNames from 'classnames'

interface InputMainProps {
  value: string | number
  id?: string
  type?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  onChange: (value: string) => void
}

const defaultProps = {
  id: '',
  type: 'text',
  placeholder: '',
  className: '',
  disabled: false,
}

function InputMain(props: InputMainProps) {
  const { id, value, type, placeholder, className, onChange, disabled } = props

  const classes = classNames({
    'flex p-2 flex-1 outline-none': true,
  })

  return (
    <input
      id={id}
      value={value}
      type={type ?? 'text'}
      className={[classes, className].join(' ')}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  )
}

InputMain.defaultProps = defaultProps

export default InputMain
