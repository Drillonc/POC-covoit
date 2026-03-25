import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationService from '../services/authentication-service';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

// Page de connexion avec formulaire pour email et mot de passe
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const result = await AuthenticationService.login(email, password);
    console.log('Login result:', result);
    if (result.success) {
      const displayName = result.fullName || email;
      localStorage.setItem('capcovoit-displayName', displayName);
      onLogin(displayName);
      navigate('/dashboard');
      return;
    }

    setError('Email ou mot de passe incorrect');
  };
  return (
    <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-panel" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <img src="../../assets/Capgemini_Primary-logo_Capgemini-Blue.png" alt="logo" className="logo-centered" height="60"/>
        <h4 className="center-align">Connexion</h4>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              id="email"
              type="email"
              className="validate"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="validate"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Mot de passe</label>
            <span className="helper-text">
              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(prev => !prev)}
                />
                <span>Afficher le mot de passe</span>
              </label>
            </span>
          </div>

          {error && <div className="card-panel red lighten-4 red-text text-darken-2">{error}</div>}

          <button className="btn waves-effect waves-light" type="submit" style={{ width: '100%' }}>
            Se connecter
          </button>
        </form>

        <p className="center-align" style={{ marginTop: '20px' }}>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
