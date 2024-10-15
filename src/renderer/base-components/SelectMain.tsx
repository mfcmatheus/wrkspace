import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Field } from 'formik'
import Lucide from './lucide'

interface SelectMainProps {
  name: string
  disabled?: boolean
  containerClasses?: string
  inputClasses?: string
  children: React.ReactNode
  icon?: string
}

const defaultProps = {
  disabled: false,
  containerClasses: '',
  inputClasses: '',
  icon: '',
}

function SelectMain(props: SelectMainProps) {
  const {
    name,
    disabled,
    children,
    containerClasses: defaultContainerClasses,
    inputClasses: defaultInputClasses,
    icon,
  } = props

  const containerClasses = useMemo(
    () =>
      classNames({
        'flex items-center rounded-[8px] shadow-[0_0_0_1px_hsla(0,0%,100%,.14)] hover:shadow-[0_0_0_1px_hsla(0,0%,100%,.24)] hover:focus-within:shadow-[0_0_0_1px_hsla(0,0%,100%,.51),0_0_0_4px_hsla(0,0%,100%,.24)] focus-within:shadow-[0_0_0_1px_hsla(0,0%,100%,.51),0_0_0_4px_hsla(0,0%,100%,.24)] bg-background transition-all ease-in-out duration-200 w-full':
          true,
        [defaultContainerClasses!]: !!defaultContainerClasses,
      }),
    [defaultContainerClasses]
  )

  const classes = useMemo(
    () =>
      classNames({
        [defaultInputClasses!]: !!defaultInputClasses,
        'h-[42px] rounded-[8px] text-[1rem] bg-transparent appearance-none px-[12px] text-white transition-all duration-200 ease-in-out outline-none w-full  !outline-none !ring-0 !border-none placeholder:text-[#9e9e9e] placeholder:font-thin':
          true,
      }),
    [defaultInputClasses]
  )

  return (
    <div className={containerClasses}>
      {icon && (
        <div className="flex pl-4 justify-center">
          <Lucide icon={icon} size={20} color="#f0f0f0" className="" />
        </div>
      )}
      <Field name={name} as="select" disabled={disabled} className={classes}>
        {children}
      </Field>
    </div>
  )
}

SelectMain.defaultProps = defaultProps

export default SelectMain
