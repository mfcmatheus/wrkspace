import Terminal from 'renderer/@types/Terminal'
import Container from 'renderer/@types/Container'
import Folder from './Folder'
import Browser from './Browser'

export default interface Workspace {
  id: number | string
  name: string
  path: string
  favorite: boolean
  folder?: Folder
  editor?: string
  terminals?: Terminal[]
  browsers?: Browser[]
  enableEditor?: boolean
  enableDocker?: boolean
  dockerOptions?: {
    enableComposer?: boolean
    enableContainers?: boolean
    enableSail?: boolean
    containers?: Container[]
  }
  loading?: boolean
  created_at: string
  opened_at?: string | number
}
