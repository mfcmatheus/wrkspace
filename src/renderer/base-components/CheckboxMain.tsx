import React from 'react'
import { Field } from 'formik'
import classNames from 'classnames'

interface CheckboxMainProps {
  as?: 'default' | 'button'
  name?: string
  disabled?: boolean
  primary?: boolean
  children?: React.ReactNode
  className?: string
}

const defaultProps: CheckboxMainProps = {
  as: 'default',
  name: '',
  disabled: false,
  children: null,
  primary: false,
  className: '',
}

function CheckboxMain(props: CheckboxMainProps) {
  const { as, name, disabled, children, primary, className } = props

  const classes = classNames({
    'font-thin text-white': as === 'default',
    'font-thin text-white cursor-pointer p-3 flex-1 text-center':
      as === 'button',
    'bg-zinc-800 text-white peer-checked/checkbox:bg-indigo-600':
      as === 'button' && primary,
    'opacity-50 cursor-not-allowed': disabled,
  })

  return (
    <label className={['flex items-center gap-x-2', className].join(' ')}>
      <Field
        type="checkbox"
        name={name}
        disabled={disabled}
        className={classNames({
          'peer/checkbox form-checkbox rounded text-indigo-500':
            as === 'default',
          'peer/checkbox hidden': as === 'button',
        })}
      />
      {children && <span className={classes}>{children}</span>}
    </label>
  )
}

CheckboxMain.defaultProps = defaultProps

export default CheckboxMain
