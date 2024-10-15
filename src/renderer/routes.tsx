import {
  MemoryRouter as Router,
  Routes as RouterRoute,
  Route,
} from 'react-router-dom'

import Dashboard from 'renderer/pages/Dashboard'
import DashboardNew from './pages/DashboardNew'
import WorkspaceEdit from './pages/WorkspaceEdit'

function Routes() {
  return (
    <Router>
      <RouterRoute>
        <Route path="/" element={<DashboardNew />} />
        <Route path="/:id/edit" element={<WorkspaceEdit />} />
      </RouterRoute>
    </Router>
  )
}

export default Routes
