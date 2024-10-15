import React, { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Lucide from 'renderer/base-components/lucide'
import MainLayout from 'renderer/layouts/MainLayout'
import WorkspaceItemSelector from 'renderer/store/selectors/WorkspaceItemSelector'

export default function WorkspaceEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const workspace = useRecoilValue(WorkspaceItemSelector(id))

  const onClickBack = useCallback(() => {
    return navigate('/')
  }, [navigate])

  return (
    <MainLayout>
      <div className="flex flex-col p-3 h-full w-[275px] bg-background rounded-l-md border border-border/75 overflow-hidden">
        <div className="flex flex-col gap-y-6 flex-grow basis-full overflow-y-auto">
          <button
            type="button"
            className="flex items-center gap-x-2"
            onClick={onClickBack}
          >
            <Lucide icon="ChevronLeft" size={24} />
            <span>Edit Workspace</span>
          </button>
        </div>
      </div>
      <div className="bg-background flex-1 rounded-r-md border border-l-0 border-border/75 overflow-hidden h-full" />
    </MainLayout>
  )
}
