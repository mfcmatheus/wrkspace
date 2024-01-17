import React, { useMemo } from 'react'

interface TitleMainProps {
  children: React.ReactNode
  as?: string
  className?: string
}

const defaultProps = {
  as: 'h1',
  className: '',
}

function TitleMain(props: TitleMainProps) {
  const { children, as: element, className } = props

  const CustomTag = useMemo(
    () => (element as React.ElementType) ?? 'span',
    [element]
  )
  const classes = useMemo(() => {
    return 'text-[2.5rem] lg:text-[4.5rem] leading-[.86] font-extrabold bg-gradient-to-b from-white to-[hsla(0,0%,100%,.75)] bg-clip-text'
  }, [])

  return (
    <CustomTag className={[classes, className].join(' ')}>{children}</CustomTag>
  )
}

TitleMain.defaultProps = defaultProps

export default TitleMain
