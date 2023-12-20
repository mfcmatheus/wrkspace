import { gql } from '@apollo/client'

export default gql`
  query WorkspacesIds {
    Workspaces {
      id
      updated_at
    }
  }
`
