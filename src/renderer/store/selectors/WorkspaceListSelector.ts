import { selector } from 'recoil'
import _ from 'lodash'
import moment from 'moment'
import WorkspaceAtom from '../atoms/WorkspaceAtom'
import SettingCurrentFolderSelector from './SettingCurrentFolderSelector'
import SettingCurrentFilterSelector from './SettingCurrentFilterSelector'
import WorkspaceListByFilterSelector from './WorkspaceListByFilterSelector'
import SettingSearchSelector from './SettingSearchSelector'

export default selector({
  key: 'workspaces.list',
  get: ({ get }) => {
    let workspaces = _(get(WorkspaceAtom) ?? [])
    const search = get(SettingSearchSelector)
    const currentFolder = get(SettingCurrentFolderSelector)
    const currentFilter = get(SettingCurrentFilterSelector)

    if (currentFilter) {
      workspaces = _(get(WorkspaceListByFilterSelector(currentFilter)) ?? [])
    }

    if (currentFilter !== 'archived') {
      workspaces = workspaces.filter((w) => !w.archived_at)
    }

    if (currentFolder) {
      workspaces = workspaces.filter((w) => w.folder?.id === currentFolder?.id)
    }

    if (search) {
      workspaces = workspaces.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return (
      workspaces
        // Sort by opened_at desc, name desc
        .sortBy(
          [
            (w) =>
              w.opened_at
                ? moment(w.opened_at, 'YYYY-MM-DD HH:mm:ss').format('x')
                : '',
            (w) => w.activities?.length,
            'name',
          ],
          ['desc', 'desc', 'asc']
        )
        .value()
    )
  },
})
