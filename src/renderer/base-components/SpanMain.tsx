import React, { useMemo } from 'react'

interface SubtitleMainProps {
	children: React.ReactNode,
	className?: string
}

const defaultProps = {
	className: '',
}

function SpanMain(props: SubtitleMainProps) {
	const { children, className } = props

	const classes = useMemo(() => {
		return "text-[.75rem] tracking-[.2rem] text-[#888] font-bold"
	}, [])
 
  return (
		<span className={[classes, className].join(' ')}>
			{children}
		</span>
  )
}

SpanMain.defaultProps = defaultProps

export default SpanMain
