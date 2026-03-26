import React from "react";
import { Ride } from "../services/ride-service";

// Composant pour afficher les détails d'un trajet et les actions possibles (s'inscrire, se désinscrire, supprimer)
interface RideCardProps {
  ride: Ride;
  onJoin?: (rideId: number) => void;
  onLeave?: (rideId: number) => void;
  onDelete?: (rideId: number) => void;
}

export default function RideCard({
  ride,
  onJoin,
  onLeave,
  onDelete
}: RideCardProps) {
  return (
    <li className="collection-item">
      <div>
        <strong>{ride.start} → {ride.end}</strong>
        <br />
        <span>Conducteur : {ride.driver.firstName} {ride.driver.lastName}</span>
        <br />
        <span>Date : {new Date(ride.date).toLocaleString()}</span>
        <br />
        <span>Places disponibles : {ride.seats}</span>
        <br/>
        <span>Passagers : {ride.passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ') || 'Pas encore de passagers'}</span>
        {/* Si on est le conducteur, on affiche un bouton pour supprimer le trajet. Si on est un passager inscrit, on affiche un bouton pour se désinscrire. Sinon, si des places sont disponibles, on affiche un bouton pour s'inscrire. */}
        <div style={{ marginTop: "10px" }}>
          {!ride.isPassed && ride.isDriver ? (
            <button className="btn red" onClick={() => onDelete?.(ride.id)}>
              Supprimer
            </button>
          ) : !ride.isPassed && ride.joined ? (
            <button className="btn orange" onClick={() => onLeave?.(ride.id)}>
              Se désinscrire
            </button>
          ) : !ride.isPassed  &&ride.seats > 0 ? (
            <button className="btn green" onClick={() => onJoin?.(ride.id)}>
              S’inscrire
            </button>
          ): null}
        </div>
      </div>
    </li>
  );
}