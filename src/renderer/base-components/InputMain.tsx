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
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const defaultProps = {
  id: '',
  type: 'text',
  placeholder: '',
  className: '',
  name: '',
  value: '',
  disabled: false,
  onChange: undefined,
  onBlur: undefined,
}

function InputMain(props: InputMainProps) {
  const {
    id,
    type,
    placeholder,
    className,
    disabled,
    name,
    value,
    onChange,
    onBlur,
  } = props

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
      {...(value ? { value } : undefined)}
      {...(onChange ? { onChange } : undefined)}
      {...(onBlur ? { onBlur } : undefined)}
    />
  )
}

InputMain.defaultProps = defaultProps

export default InputMain
