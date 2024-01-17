import { gql } from '@apollo/client'

export default gql`
  query Folder($id: ID!) {
    Folder(id: $id) {
      id
      name
      created_at
      updated_at
    }
  }
`
