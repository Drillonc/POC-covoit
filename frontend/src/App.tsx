import { Navigate, Route, Routes } from 'react-router-dom';
import HelloPage from './pages/HelloPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const storedUser = localStorage.getItem('capcovoit-user');

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/hello"
        element={storedUser ? <HelloPage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
