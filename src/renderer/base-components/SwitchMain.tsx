import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Field, useField } from 'formik'

interface SwitchMainProps {
  name?: string
  id?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  primary?: boolean
}

function SwitchMain(props: SwitchMainProps) {
  const { name, id, disabled, onChange, xs, sm, md, lg, primary } = props

  const [fieldCheckbox] = useField(name ?? '')

  const isChecked = useMemo(() => fieldCheckbox.value, [fieldCheckbox.value])

  const wrapperClasses = useMemo(
    () =>
      classNames({
        'relative inline-flex cursor-pointer select-none items-center': true,
        'opacity-50': disabled,
      }),
    [disabled]
  )

  const switchClasses = useMemo(
    () =>
      classNames({
        'slider flex items-center rounded-full p-1 duration-200 bg-[#CCCCCE]':
          true,
        '!bg-gradient-to-r from-highlight-primary to-highlight-secondary':
          isChecked && primary,
        'w-[30px] h-4': xs,
        'w-[36px] h-6': sm,
        'w-[48px] h-7': md,
        'w-[60px] h-8': lg,
      }),
    [isChecked, primary, xs, sm, md, lg]
  )

  const dotClasses = useMemo(
    () =>
      classNames({
        'dot rounded-full bg-white duration-200': true,
        'translate-x-[11px]': isChecked && xs,
        'translate-x-[12px]': isChecked && sm,
        'translate-x-[20px]': isChecked && md,
        'translate-x-[28px]': isChecked && lg,
        'h-3 w-3': xs,
        'h-4 w-4': sm,
        'h-5 w-5': md,
        'h-6 w-6': lg,
      }),
    [isChecked, xs, sm, md, lg]
  )

  return (
    <label className={wrapperClasses}>
      <Field
        name={name}
        id={id}
        disabled={disabled}
        type="checkbox"
        className="sr-only"
        {...(onChange ? { onChange } : {})}
      />
      <span className={switchClasses}>
        <span className={dotClasses} />
      </span>
    </label>
  )
}

SwitchMain.defaultProps = {
  name: '',
  id: '',
  disabled: false,
  onChange: null,
  xs: false,
  sm: false,
  md: false,
  lg: false,
  primary: false,
}

export default SwitchMain
