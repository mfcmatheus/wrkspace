import { selector } from 'recoil'
import _ from 'lodash'
import moment from 'moment'
import WorkspaceAtom from '../atoms/WorkspaceAtom'
import SettingCurrentFolderSelector from './SettingCurrentFolderSelector'
import SettingCurrentFilterSelector from './SettingCurrentFilterSelector'
import WorkspaceListByFilterSelector from './WorkspaceListByFilterSelector'

export default selector({
  key: 'workspaces.list',
  get: ({ get }) => {
    let workspaces = _(get(WorkspaceAtom) ?? [])
    const currentFolder = get(SettingCurrentFolderSelector)
    const currentFilter = get(SettingCurrentFilterSelector)

    if (currentFilter) {
      workspaces = _(get(WorkspaceListByFilterSelector(currentFilter)) ?? [])
    }

    if (currentFolder) {
      workspaces = workspaces.filter((w) => w.folder?.id === currentFolder?.id)
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
            'name',
          ],
          ['desc', 'asc']
        )
        .value()
    )
  },
})
