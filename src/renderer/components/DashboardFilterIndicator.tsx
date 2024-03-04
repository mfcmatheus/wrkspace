import React, { useMemo } from 'react'
import { Formik } from 'formik'

import Lucide from 'renderer/base-components/lucide'
import DashboardFilterIndicatorTooltip from 'renderer/components/DashboardFilterIndicatorTooltip'
import Filters from 'renderer/@types/Filters'

interface DashboardFilterIndicatorProps {
  setFilters: (filters: Filters) => void
}

export default function DashboardFilterIndicator(
  props: DashboardFilterIndicatorProps
) {
  const { setFilters } = props

  const initialValues = useMemo(
    () => ({
      filters: {
        features: {
          enableEditor: true,
        },
        browsers: true,
        terminals: true,
        docker: {
          enableComposer: true,
          enableContainers: true,
        },
      },
    }),
    []
  )

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ dirty }) => (
        <>
          <button type="button" id="filter-button">
            <Lucide
              icon="Filter"
              size="24"
              color={dirty ? '#fff' : '#6f6f6f'}
              strokeWidth={1}
            />
          </button>
          <DashboardFilterIndicatorTooltip setFilters={setFilters} />
        </>
      )}
    </Formik>
  )
}
