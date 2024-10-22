import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const env = JSON.parse(localStorage.getItem('env') || '{}')

const httpLink = new HttpLink({
  uri:
    env.NODE_ENV === 'development'
      ? `http://127.0.0.1/graphql/user`
      : `https://api.wrkspace.co/graphql/user`,
  origin:
    env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:1212'
      : 'https://wrkspace.co',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  console.log('AHAHHAHA', token)

  return {
    headers: {
      ...headers,
      'Access-Control-Allow-Origin':
        env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:1212'
          : 'https://wrkspace.co',

      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, Content-Length, X-Requested-With',
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
} as DefaultOptions

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions,
})

export default client
