import Folder from './Folder'

export default interface Setting {
  folders: Folder[]
  currentFolder?: Folder
  defaultPath: string
  configured: boolean
}
