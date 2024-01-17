export default interface Folder {
  id: string | number
  name: string
  path: string
  updated_at?: string
  deleted_at?: string
  created?: boolean
  deleted?: boolean
}
