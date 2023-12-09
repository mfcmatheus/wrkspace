import { gql } from '@apollo/client'

export default gql`
  query Me {
    Me {
      id
      name
      email
      token
    }
  }
`
