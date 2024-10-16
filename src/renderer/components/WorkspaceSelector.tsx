import { getIn, useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import SelectMain from 'renderer/base-components/SelectMain'
import WorkspaceAtom from 'renderer/store/atoms/WorkspaceAtom'

export default function WorkspaceSelector() {
  const navigate = useNavigate()
  const { id: originalId } = useParams<{ id: string }>()
  const workspaces = useRecoilValue(WorkspaceAtom)
  const { values } = useFormikContext()

  const id = getIn(values, 'id')

  useEffect(() => {
    if (originalId === id) return
    navigate(`/${id}/edit`)
  }, [id, originalId, navigate])

  return (
    <div className="p-1 w-full">
      <SelectMain
        name="id"
        inputClasses="!h-[30px] !p-0 !px-3 !font-thin !text-sm"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </SelectMain>
    </div>
  )
}
