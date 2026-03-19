import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../services/authentication-service';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const success = await AuthenticationService.login(username, password);
    if (success) {
      localStorage.setItem('capcovoit-user', username);
      navigate('/hello');
      return;
    }

    setError('Nom d\'utilisateur ou mot de passe incorrect');
  };

  return (
    <div className="page">
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Nom d'utilisateur
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
