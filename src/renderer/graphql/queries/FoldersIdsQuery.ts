import { gql } from '@apollo/client'

export default gql`
  query FoldersIds {
    Folders {
      id
      name
      updated_at
    }
  }
`
