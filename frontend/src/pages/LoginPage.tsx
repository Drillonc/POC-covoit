import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationService from '../services/authentication-service';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const result = await AuthenticationService.login(username, password);
    console.log('Login result:', result);
    if (result.success) {
      const displayName = result.fullName || username;
      localStorage.setItem('capcovoit-user', displayName);
      onLogin(displayName);
      navigate('/hello');
      return;
    }

    setError('Nom d\'utilisateur ou mot de passe incorrect');
  };
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: 420 }}>
        <h1 className="h4 mb-4 text-center">Connexion</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? 'Cacher' : 'Afficher'}
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-primary w-100" type="submit">
            Se connecter
          </button>
        </form>

        <p className="text-center mt-3">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
