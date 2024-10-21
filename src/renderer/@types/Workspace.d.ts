import Terminal from 'renderer/@types/Terminal'
import Container from 'renderer/@types/Container'
import Folder from 'renderer/@types/Folder'
import Browser from 'renderer/@types/Browser'
import EnvVar from 'renderer/@types/EnvVar'
import Command from './Command'
import Process from './Process'

export default interface Workspace {
  id: number | string
  name: string
  path: string
  repo: string
  favorite: boolean
  folder?: Folder
  editor?: string
  terminals?: Terminal[]
  browsers?: Browser[]
  features?: {
    enableEditor?: boolean
    enableDocker?: boolean
  }
  docker?: {
    enableComposer?: boolean
    enableContainers?: boolean
    enableSail?: boolean
    enableBuild?: boolean
    containers?: Container[]
  }
  installation?: {
    commands?: Command[]
    variables?: EnvVar[]
  }
  activities?: unknown[]
  times_opened?: number
  processes?: Process[]
  loading?: boolean
  updated_at: string
  created_at: string
  deleted_at?: string
  deleted?: boolean
  created?: boolean
  updated?: boolean
  opened_at?: string | number
  archived_at?: string | number
}
