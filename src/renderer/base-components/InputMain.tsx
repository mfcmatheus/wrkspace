import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Field } from 'formik'

import Lucide from 'renderer/base-components/lucide'

interface InputMainProps {
  id?: string
  type?: string
  placeholder?: string
  containerClasses?: string
  inputClasses?: string
  disabled?: boolean
  readOnly?: boolean
  name?: string
  value?: string
  defaultValue?: string
  icon?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const defaultProps = {
  id: '',
  type: 'text',
  placeholder: '',
  containerClasses: '',
  inputClasses: '',
  name: '',
  value: '',
  defaultValue: '',
  icon: null,
  disabled: false,
  readOnly: false,
  onChange: undefined,
  onBlur: undefined,
}

function InputMain(props: InputMainProps) {
  const {
    id,
    type,
    placeholder,
    containerClasses: defaultContainerClasses,
    inputClasses: defaultInputClasses,
    disabled,
    readOnly,
    name,
    value,
    defaultValue,
    icon,
    onChange,
    onBlur,
  } = props

  const containerClasses = useMemo(
    () =>
      classNames({
        'flex flex-1 items-center rounded-[8px] shadow-[0_0_0_1px_hsla(0,0%,100%,.14)] hover:shadow-[0_0_0_1px_hsla(0,0%,100%,.24)] hover:focus-within:shadow-[0_0_0_1px_hsla(0,0%,100%,.51),0_0_0_4px_hsla(0,0%,100%,.24)] focus-within:shadow-[0_0_0_1px_hsla(0,0%,100%,.51),0_0_0_4px_hsla(0,0%,100%,.24)] bg-[#202020] transition-all ease-in-out duration-200':
          true,
        [defaultContainerClasses!]: !!defaultContainerClasses,
      }),
    [defaultContainerClasses]
  )

  const inputClasses = useMemo(
    () =>
      classNames({
        'w-full h-[42px] rounded-[8px] text-[1rem] bg-transparent appearance-none px-[12px] text-white transition-all duration-200 ease-in-out !outline-none !ring-0 !border-none placeholder:text-[#9e9e9e] placeholder:font-thin':
          true,
        'resize-none !h-auto': type === 'textarea',
        'text-white/75': readOnly,
        [defaultInputClasses!]: !!defaultInputClasses,
      }),
    [defaultInputClasses, type]
  )

  return (
    <div className={containerClasses}>
      {icon && (
        <div className="flex pl-4 justify-center">
          <Lucide icon={icon} size={20} color="#f0f0f0" className="" />
        </div>
      )}
      <Field
        id={id}
        name={name}
        type={type ?? 'text'}
        className={inputClasses}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        rows={type === 'textarea' ? 4 : undefined}
        {...(value ? { value } : undefined)}
        {...(defaultValue ? { defaultValue } : undefined)}
        {...(onChange ? { onChange } : undefined)}
        {...(onBlur ? { onBlur } : undefined)}
      />
    </div>
  )
}

InputMain.defaultProps = defaultProps

export default InputMain
