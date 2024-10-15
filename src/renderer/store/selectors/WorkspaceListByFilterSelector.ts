import { selectorFamily } from 'recoil'
import Workspace from 'renderer/@types/Workspace'
import WorkspaceAtom from '../atoms/WorkspaceAtom'

const filters = {
  favorites: (w: Workspace) => w.favorite,
  most_used: (w: Workspace) => false, // TODO
  never_used: (w: Workspace) => !w.opened_at,
  not_installed: (w: Workspace) => false, // TODO
  archived: (w: Workspace) => !!w.archived_at,
} as Record<string, (w: Workspace) => boolean>

export default selectorFamily({
  key: 'workspaces.list.byFilter',
  get:
    (filter: string) =>
    ({ get }) => {
      let workspaces = get(WorkspaceAtom)

      if (filter) {
        workspaces = workspaces.filter(filters[filter])
      }

      return workspaces
    },
})
