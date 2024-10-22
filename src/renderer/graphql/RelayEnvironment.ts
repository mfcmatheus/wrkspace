// RelayEnvironment.js
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

async function fetchRelay(params, variables) {
  const token = localStorage.getItem('token')
  console.log(token)

  if (!token) {
    return Promise.reject(new Error('No token defined'))
  }

  // TODO: Catch errors and prevent fetch if offline

  const url =
    process.env.NODE_ENV === 'development'
      ? `http://127.0.0.1/graphql/user`
      : `https://api.wrkspace.co/graphql/user`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:1212'
            : 'https://wrkspace.co',

        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Content-Length, X-Requested-With',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    })

    const json = await response.json()
    return json
  } catch (err) {
    return Promise.reject(err)
  }
}

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
})
