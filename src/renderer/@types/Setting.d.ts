import Folder from './Folder'

export default interface Setting {
  folders: Folder[]
  currentFolder?: Folder | null
  defaultPath: string
  configured: boolean
  currentView: number
  isMenuFolderOpened: boolean
  currentTeam?: unknown | null // TODO: Define Team type
  currentFilter?:
    | 'favorites'
    | 'most_used'
    | 'never_used'
    | 'not_installed'
    | 'archived'
    | null

  showSearch: boolean
  search: string
}
