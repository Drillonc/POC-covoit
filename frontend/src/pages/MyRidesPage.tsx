import { useState, useEffect, FormEvent } from 'react';
import RideService, { Ride } from '../services/ride-service';

export default function MyRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState('');

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      setLoading(true);
      const data = await RideService.getMyRides();
      setRides(data);
    } catch (err) {
      setError('Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await RideService.createRide(start, end, seats, date);
      setShowCreateForm(false);
      setStart('');
      setEnd('');
      setSeats(1);
      setDate('');
      loadRides();
    } catch (err) {
      setError('Erreur lors de la création du trajet');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return;
    try {
      await RideService.deleteRide(id);
      loadRides();
    } catch (err) {
      setError('Erreur lors de la suppression du trajet');
    }
  };

  if (loading) return <div className="center-align">Chargement...</div>;
  if (error) return <div className="card-panel red lighten-4 red-text text-darken-2">{error}</div>;

  return (
    <div>
      <div className="row">
        <div className="col s12">
          <button
            className="btn waves-effect waves-light"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Annuler' : 'Créer un trajet'}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="row">
          <div className="col s12">
            <div className="card-panel">
              <h5>Créer un trajet</h5>
              <form onSubmit={handleCreate}>
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="start"
                      type="text"
                      value={start}
                      onChange={e => setStart(e.target.value)}
                      required
                    />
                    <label htmlFor="start">Départ</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="end"
                      type="text"
                      value={end}
                      onChange={e => setEnd(e.target.value)}
                      required
                    />
                    <label htmlFor="end">Arrivée</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="seats"
                      type="number"
                      min="1"
                      value={seats}
                      onChange={e => setSeats(Number(e.target.value))}
                      required
                    />
                    <label htmlFor="seats">Places disponibles</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="date"
                      type="datetime-local"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                    <label htmlFor="date">Date et heure</label>
                  </div>
                </div>
                <button className="btn waves-effect waves-light" type="submit">
                  Créer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col s12">
          <h5>Mes trajets</h5>
          {rides.length === 0 ? (
            <p>Aucun trajet créé.</p>
          ) : (
            <ul className="collection">
              {rides.map(ride => (
                <li key={ride.id} className="collection-item">
                  <div>
                    <strong>{ride.start} → {ride.end}</strong>
                    <br />
                    <span>Date: {new Date(ride.date).toLocaleString()}</span>
                    <br />
                    <span>Places: {ride.seats}</span>
                    <a
                      href="#!"
                      className="secondary-content red-text"
                      onClick={() => handleDelete(ride.id)}
                    >
                      <i className="material-icons">delete</i>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}