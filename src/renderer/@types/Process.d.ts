import Workspace from './Workspace'

export default interface Process {
  pid: number | string
  title: string
  workspace: Workspace
  data: string[]
  running: boolean
}
