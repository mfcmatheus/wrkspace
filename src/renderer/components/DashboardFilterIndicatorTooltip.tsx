import { Form, useField } from 'formik'
import React, { useEffect } from 'react'
import { Tooltip } from 'react-tooltip'

import Filters from 'renderer/@types/Filters'
import SwitchMain from 'renderer/base-components/SwitchMain'

interface DashboardFilterIndicatorTooltipProps {
  setFilters: (filters: Filters) => void
}

export default function DashboardFilterIndicatorTooltip(
  props: DashboardFilterIndicatorTooltipProps
) {
  const { setFilters } = props
  const [field] = useField('filters')

  useEffect(() => {
    setFilters(field.value)
  }, [field.value, setFilters])

  return (
    <Tooltip
      style={{ backgroundColor: '#181818' }}
      anchorSelect="#filter-button"
      place="bottom"
      clickable
    >
      <Form className="flex flex-col">
        <span className="mb-4">Filter by feature</span>
        <div className="flex gap-x-2">
          <SwitchMain primary xs name="filters.features.enableEditor" />
          Editor
        </div>
        <div className="flex gap-x-2">
          <SwitchMain primary xs name="filters.browsers" />
          Pages
        </div>
        <div className="flex gap-x-2">
          <SwitchMain primary xs name="filters.terminals" />
          Terminals
        </div>
        <div className="flex gap-x-2">
          <SwitchMain primary xs name="filters.docker.enableComposer" />
          Docker compose
        </div>
        <div className="flex gap-x-2">
          <SwitchMain primary xs name="filters.docker.enableContainers" />
          Docker containers
        </div>
      </Form>
    </Tooltip>
  )
}
