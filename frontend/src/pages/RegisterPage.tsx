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
      navigate('/');
      return;
    }

    setError('Impossible de créer le compte. Email déjà utilisé ou données invalides.');
  };
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: 420 }}>
        <h1 className="h4 mb-4 text-center">Créer un compte</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Prénom</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-success w-100" type="submit">
            S'inscrire
          </button>
        </form>

        <p className="text-center mt-3">
          Déjà membre ? <a href="/">Se connecter</a>
        </p>
      </div>
    </div>
  );
}