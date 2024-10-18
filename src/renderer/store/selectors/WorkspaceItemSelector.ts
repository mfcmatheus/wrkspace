import { selectorFamily } from 'recoil'
import Workspace from 'renderer/@types/Workspace'
import ElectronApi from 'services/ElectronApi'
import WorkspaceAtom from '../atoms/WorkspaceAtom'

export default selectorFamily({
  key: 'workspace.item',
  get:
    (id: string) =>
    ({ get }) => {
      return get(WorkspaceAtom).find((w) => w.id === id)
    },
  set:
    (id: string | undefined) =>
    ({ set }, newValue: Workspace) => {
      const isEditing = !!id

      if (isEditing) {
        set(WorkspaceAtom, (old) => {
          const values = [...old]
          const index = old.findIndex((w) => w.id === newValue.id)
          values[index] = newValue
          return values
        })
        ElectronApi.call('workspaces.update', newValue)

        return
      }

      set(WorkspaceAtom, (old) => {
        const values = [...old]
        values.push(newValue)
        return values
      })
      ElectronApi.call('workspaces.create', newValue)
    },
})
