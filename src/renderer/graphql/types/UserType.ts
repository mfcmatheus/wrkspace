import { gql } from '@apollo/client'

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
  }
`
