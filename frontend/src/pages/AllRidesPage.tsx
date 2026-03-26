import { useState, useEffect } from 'react';
import RideService, { Ride } from '../services/ride-service';
import RideCard from '../components/RideCard';
import { SearchBox } from '@mapbox/search-js-react';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZHJpbGxvbmMiLCJhIjoiY21uNzl6b2JiMDVwZDJwcXg3M2xzcGFreiJ9.yQoDn2K8TvurkuudA_eKYg';

export default function AllRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [noResult, setNoResult] = useState(false);

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

  const filteredRides = rides.filter((ride) => {
    if (!searchCity) return true;

    const startCity = ride.start?.toLowerCase() || '';
    const endCity = ride.end?.toLowerCase() || '';

    return (
      startCity.includes(searchCity.toLowerCase()) ||
      endCity.includes(searchCity.toLowerCase())
    );
  });

  if (loading)
    return <div className="center-align">Chargement...</div>;

  if (error)
    return (
      <div className="card-panel red lighten-4 red-text text-darken-2">
        {error}
      </div>
    );

  return (
    <div>
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h5>Rechercher un trajet</h5>

            <SearchBox
              accessToken={MAPBOX_ACCESS_TOKEN}
              options={{
                language: 'fr',
                proximity: 'ip'
              }}
              onRetrieve={(res) => {
                console.log("onRetrieve result:", res);
                const feat = res.features[0];
                if (!feat) return;

                const city = feat.properties.context.place?.name;
                if (city == null) {
                  setNoResult(true);
                  setSearchCity("");
                } else {
                  setNoResult(false);
                  setSearchCity(city.toLowerCase());
                }
              }}
              onClear={
                () => {
                  setNoResult(false);
                  setSearchCity("");
                }
              }
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col s12">
          <h5>Tous les trajets</h5>

          {filteredRides.length === 0 || noResult ? (
            <p>Aucun trajet renseigné
            </p>
          ) : (
            <ul className="collection">
              {filteredRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
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