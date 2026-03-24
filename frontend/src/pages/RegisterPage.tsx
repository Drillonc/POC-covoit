import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../services/authentication-service';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const success = await AuthenticationService.register(email, firstName, lastName, password);
    if (success) {
      const displayName = `${firstName} ${lastName}`;
      localStorage.setItem('capcovoit-displayName', displayName);
      navigate('/');
      return;
    }

    setError('Impossible de créer le compte. Email déjà utilisé ou données invalides.');
  };
  return (
    <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-panel" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <h4 className="center-align">Créer un compte</h4>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              id="email"
              type="email"
              className="validate"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-field">
            <input
              id="firstName"
              type="text"
              className="validate"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="firstName">Prénom</label>
          </div>

          <div className="input-field">
            <input
              id="lastName"
              type="text"
              className="validate"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
            <label htmlFor="lastName">Nom</label>
          </div>

          <div className="input-field">
            <input
              id="password"
              type="password"
              className="validate"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Mot de passe</label>
          </div>

          {error && <div className="card-panel red lighten-4 red-text text-darken-2">{error}</div>}
          <button className="btn waves-effect waves-light" type="submit" style={{ width: '100%' }}>
            S'inscrire
          </button>
        </form>

        <p className="center-align" style={{ marginTop: '20px' }}>
          Déjà membre ? <a href="/">Se connecter</a>
        </p>
      </div>
    </div>
  );
}