import { selectorFamily } from 'recoil'
import Workspace from 'renderer/@types/Workspace'
import ProcessAtom from '../atoms/ProcessAtom'

export default selectorFamily({
  key: 'processes.byWorkspace',
  get:
    (workspace: Workspace) =>
    ({ get }) => {
      const processes = get(ProcessAtom)
      return processes.filter((p) => p.workspace.id === workspace.id) ?? []
    },
})
