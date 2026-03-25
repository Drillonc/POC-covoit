import { useState, useEffect, FormEvent } from 'react';
import RideService, { Ride } from '../services/ride-service';
import RideCard from '../components/RideCard';

// Page pour afficher les trajets créés par l'utilisateur et les trajets auxquels il est inscrit
export default function MyRidesPage() {
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [joinedRides, setJoinedRides] = useState<Ride[]>([]);
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
      const mydata = await RideService.getMyRides();
      setMyRides(mydata);
      const joineddata = await RideService.getJoinedRides();
      setJoinedRides(joineddata);

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

          {myRides.length === 0 ? (
            <p>Aucun trajet créé.</p>
          ) : (
            <ul className="collection">
              {myRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col s12">
          <h5>Mes inscriptions</h5>

          {joinedRides.length === 0 ? (
            <p>Aucune inscription</p>
          ) : (
            <ul className="collection">
              {joinedRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}