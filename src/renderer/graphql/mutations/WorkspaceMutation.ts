import { gql } from '@apollo/client'

export default gql`
  mutation Workspace($workspace: WorkspaceInput) {
    Workspace(data: $workspace) {
      id
      updated_at
    }
  }
`
