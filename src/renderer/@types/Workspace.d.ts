import Terminal from 'renderer/@types/Terminal'

export default interface Workspace {
  id: number | string
  name: string
  path: string
  terminals?: Terminal[]
  enableDocker: boolean
  enableDockerCompose?: boolean
  enableDockerContainers?: boolean
  created_at: string
  opened_at?: string
}
