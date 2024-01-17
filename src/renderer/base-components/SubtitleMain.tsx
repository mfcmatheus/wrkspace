import React, { useMemo } from 'react'

interface SubtitleMainProps {
  children: React.ReactNode
  as?: string
  className?: string
}

const defaultProps = {
  as: 'p',
  className: '',
}

function SubtitleMain(props: SubtitleMainProps) {
  const { children, as: element, className } = props

  const CustomTag = useMemo(
    () => (element as React.ElementType) ?? 'span',
    [element]
  )
  const classes = useMemo(() => {
    return 'text-base lg:text-[1.25rem] font-thin text-[#888]'
  }, [])

  return (
    <CustomTag className={[classes, className].join(' ')}>{children}</CustomTag>
  )
}

SubtitleMain.defaultProps = defaultProps

export default SubtitleMain
