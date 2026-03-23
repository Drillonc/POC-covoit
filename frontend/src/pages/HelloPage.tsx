import { useNavigate } from 'react-router-dom';

export default function HelloPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('capcovoit-user');

  const logout = () => {
    localStorage.removeItem('capcovoit-user');
    navigate('/');
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-sm p-4 text-center position-relative" style={{ width: '100%', maxWidth: 420 }}>
        <button
          className="btn btn-sm btn-outline-danger position-absolute"
          style={{ top: 10, right: 10 }}
          onClick={logout}
          title="Se déconnecter"
        >
          ⏻
        </button>
        <h1 className="h4">Bonjour {username ?? 'utilisateur'}</h1>
        <p>Vous êtes connecté.</p>
      </div>
    </div>
  );
}
