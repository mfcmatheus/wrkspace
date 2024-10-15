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
    () =>
    ({ set }, newValue: Workspace) => {
      set(WorkspaceAtom, (old) => {
        const values = [...old]
        const index = old.findIndex((w) => w.id === newValue.id)
        values[index] = newValue
        return values
      })
      ElectronApi.call('workspaces.update', newValue)
    },
})
