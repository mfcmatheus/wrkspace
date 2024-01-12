import { gql } from '@apollo/client'

export default gql`
  mutation WorkspaceDelete($id: Int!) {
    WorkspaceDelete(id: $id)
  }
`
