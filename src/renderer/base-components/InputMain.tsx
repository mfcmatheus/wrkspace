import React from 'react'
import classNames from 'classnames'
import { Field } from 'formik'

interface InputMainProps {
  id?: string
  type?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  name?: string
}

const defaultProps = {
  id: '',
  type: 'text',
  placeholder: '',
  className: '',
  name: '',
  disabled: false,
}

function InputMain(props: InputMainProps) {
  const { id, type, placeholder, className, disabled, name } = props

  const classes = classNames({
    'flex p-2 flex-1 outline-none': true,
  })

  return (
    <Field
      id={id}
      name={name}
      type={type ?? 'text'}
      className={[classes, className].join(' ')}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}

InputMain.defaultProps = defaultProps

export default InputMain
