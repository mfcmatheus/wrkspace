import {
  MemoryRouter as Router,
  Routes as RouterRoute,
  Route,
} from 'react-router-dom'

import { Suspense } from 'react'
import Dashboard from 'renderer/pages/Dashboard'
import WorkspaceEdit from './pages/WorkspaceEdit'
import Settings from './pages/Settings'

function Routes() {
  return (
    <Router>
      <RouterRoute>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route path="/new" element={<WorkspaceEdit />} />
        <Route path="/:id/edit" element={<WorkspaceEdit />} />
        <Route path="/settings" element={<Settings />} />
      </RouterRoute>
    </Router>
  )
}

export default Routes
