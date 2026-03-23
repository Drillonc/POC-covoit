import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HelloPage from './pages/HelloPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [storedUser, setStoredUser] = useState<string | null>(
    localStorage.getItem('capcovoit-user'),
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
        path="/hello"
        element={storedUser ? <HelloPage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
