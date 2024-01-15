import { gql } from '@apollo/client'

export default gql`
  mutation FolderDelete($id: Int!) {
    FolderDelete(id: $id)
  }
`
