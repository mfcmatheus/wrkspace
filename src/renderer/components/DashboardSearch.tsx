import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import InputMain from 'renderer/base-components/InputMain'

interface DashboardSearchProps {
  onSearch: (search: string | null) => void
}

export default function DashboardSearch(props: DashboardSearchProps) {
  const { onSearch } = props

  const [search, setSearch] = useState<string | null>(null)

  useEffect(() => {
    if (!search || search === '') {
      onSearch(null)
      return
    }
    onSearch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <InputMain
      standard
      placeholder="Search..."
      containerClasses={classNames({
        'w-full !h-[36px] ml-1': true,
        '!shadow-[0_0_0_1px_rgba(255,255,255,1)]': !!search,
      })}
      onChange={(e) => setSearch(e.target.value.trim().toLocaleLowerCase())}
    />
  )
}
