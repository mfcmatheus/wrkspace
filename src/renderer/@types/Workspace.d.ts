import Terminal from 'renderer/@types/Terminal'
import Container from 'renderer/@types/Container'

export default interface Workspace {
  id: number | string
  name: string
  path: string
  terminals?: Terminal[]
  enableDocker: boolean
  enableDockerCompose?: boolean
  enableDockerContainers?: boolean
  containers?: Container[]
  loading?: boolean
  created_at: string
  opened_at?: string
}
