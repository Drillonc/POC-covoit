import { useState, useEffect } from 'react';
import RideService, { Ride } from '../services/ride-service';

export default function AllRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      setLoading(true);
      const data = await RideService.getAllRides();
      setRides(data);
    } catch (err) {
      setError('Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="center-align">Chargement...</div>;
  if (error) return <div className="card-panel red lighten-4 red-text text-darken-2">{error}</div>;

  return (
    <div>
      <div className="row">
        <div className="col s12">
          <h5>Tous les trajets</h5>
          {rides.length === 0 ? (
            <p>Aucun trajet disponible.</p>
          ) : (
            <ul className="collection">
              {rides.map(ride => (
                <li key={ride.id} className="collection-item">
                  <div>
                    <strong>{ride.start} → {ride.end}</strong>
                    <br />
                    <span>Conducteur: {ride.driver.firstName} {ride.driver.lastName}</span>
                    <br />
                    <span>Date: {new Date(ride.date).toLocaleString()}</span>
                    <br />
                    <span>Places disponibles: {ride.seats}</span>
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