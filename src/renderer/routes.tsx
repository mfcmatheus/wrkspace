import {
  MemoryRouter as Router,
  Routes as RouterRoute,
  Route,
} from 'react-router-dom'

import Dashboard from 'renderer/pages/Dashboard'

function Routes() {
  return (
    <Router>
      <RouterRoute>
        <Route path="/" element={<Dashboard />} />
      </RouterRoute>
    </Router>
  )
}

export default Routes
