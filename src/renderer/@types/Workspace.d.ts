import Terminal from 'renderer/@types/Terminal'

export default interface Workspace {
  id: number | string
  name: string
  path: string
  terminals?: Terminal[]
  created_at: string
  opened_at?: string
}
