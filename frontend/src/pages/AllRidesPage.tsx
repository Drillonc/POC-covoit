import { useState, useEffect } from 'react';
import RideService, { Ride } from '../services/ride-service';
import RideCard from '../components/RideCard';

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

  const handleJoin = async (rideId: number) => {
    await RideService.joinRide(rideId);
    loadRides();
  };

  
const handleLeave = async (rideId: number) => {
  await RideService.leaveRide(rideId);
  loadRides();
};

const handleDelete = async (rideId: number) => {
  await RideService.deleteRide(rideId);
  loadRides();
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
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  showJoinButton={true}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}