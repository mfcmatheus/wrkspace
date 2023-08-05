import React, { useEffect } from 'react'
import * as lucideIcons from 'lucide-react'

interface LucideProps {
  icon: string
  className?: string
}

const Lucide = ({ icon, className, ...computedProps }: LucideProps) => {
  const Element = lucideIcons[icon]

  useEffect(() => {
    if (Element === undefined) {
      throw `Lucide icon '${icon}' not found.`
    }
  }, [Element, icon])

  return (
    <Element className={`lucide ${className}`} {...computedProps} />
  )
}

export default Lucide
