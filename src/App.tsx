import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { DatabaseDashboard } from './pages/DatabaseDashboard';
import { MatriculaDetail } from './pages/MatriculaDetail';
import { CicaAnalytics } from './pages/CicaAnalytics';
import { ReconocedoresAnalytics } from './pages/ReconocedoresAnalytics';
import LoginForm from './components/LoginForm';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Routes>
          <Route path="/databases" element={<DatabaseDashboard />} />
          <Route path="/matricula/:matricula" element={<MatriculaDetail />} />
          <Route path="/analytics/cica" element={<CicaAnalytics />} />
          <Route path="/analytics/reconocedores" element={<ReconocedoresAnalytics />} />
          <Route path="/" element={<Navigate to="/databases" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;