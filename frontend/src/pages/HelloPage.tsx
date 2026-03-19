import { useNavigate } from 'react-router-dom';

export default function HelloPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('capcovoit-user');

  const logout = () => {
    localStorage.removeItem('capcovoit-user');
    navigate('/');
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Bonjour {username ?? 'utilisateur'}</h1>
        <p>Vous êtes connecté.</p>
        <button onClick={logout}>Se déconnecter</button>
      </div>
    </div>
  );
}
