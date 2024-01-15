import { gql } from '@apollo/client'

export default gql`
  query WorkspacesIds {
    Workspaces {
      id
      name
      updated_at
      folder {
        id
      }
    }
  }
`
