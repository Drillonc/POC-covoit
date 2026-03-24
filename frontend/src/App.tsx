import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [storedUser, setStoredUser] = useState<string | null>(
    localStorage.getItem('capcovoit-displayName'),
  );

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage onLogin={(username: string) => setStoredUser(username)} />}
      />
      <Route
        path="/register"
        element={<RegisterPage />}
      />
      <Route
        path="/dashboard"
        element={storedUser ? <DashboardPage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
