import React, { useMemo } from 'react'
import { Field } from 'formik'
import classNames from 'classnames'

interface CheckboxMainProps {
  as?: 'default' | 'button'
  name?: string
  disabled?: boolean
  primary?: boolean
  children?: React.ReactNode
  sm?: boolean
  className?: string
  labelClassName?: string
  value?: string
  checked?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const defaultProps: CheckboxMainProps = {
  as: 'default',
  name: '',
  disabled: false,
  children: null,
  primary: false,
  sm: false,
  className: '',
  labelClassName: '',
  value: '',
  checked: false,
  onChange: undefined,
}

function CheckboxMain(props: CheckboxMainProps) {
  const {
    as,
    name,
    disabled,
    children,
    primary,
    className,
    labelClassName,
    value,
    sm,
    onChange,
    checked,
  } = props

  const classes = useMemo(
    () =>
      classNames({
        'font-thin text-white': as === 'default',
        'font-thin text-white cursor-pointer flex-1 text-center':
          as === 'button',
        'bg-zinc-800 text-white peer-checked/checkbox:bg-primary':
          as === 'button' && primary,
        'opacity-50 cursor-not-allowed': disabled,
        'p-2 text-sm': !sm,
        'p-1 text-xs': sm,
      }),
    [as, primary, disabled, sm]
  )

  return (
    <label className={['flex items-center gap-x-2', className].join(' ')}>
      <Field
        type="checkbox"
        name={name}
        disabled={disabled}
        className={classNames({
          'peer/checkbox form-checkbox rounded text-primary': as === 'default',
          'peer/checkbox hidden': as === 'button',
        })}
        {...(checked ? { checked } : {})}
        {...(value ? { value } : {})}
        {...(onChange ? { onChange } : {})}
      />
      {children && (
        <span className={[classes, labelClassName].join(' ')}>{children}</span>
      )}
    </label>
  )
}

CheckboxMain.defaultProps = defaultProps

export default CheckboxMain
