import React from "react";
import { Ride } from "../services/ride-service";

interface RideCardProps {
  ride: Ride;
  showJoinButton?: boolean;
  showLeaveButton?: boolean;
  showDeleteButton?: boolean;
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

        <div style={{ marginTop: "10px" }}>
          {ride.isDriver ? (
            <button className="btn red" onClick={() => onDelete?.(ride.id)}>
              Supprimer
            </button>
          ) : ride.joined ? (
            <button className="btn orange" onClick={() => onLeave?.(ride.id)}>
              Se désinscrire
            </button>
          ) : (
            <button className="btn green" onClick={() => onJoin?.(ride.id)}>
              S’inscrire
            </button>
          )}
        </div>
      </div>
    </li>
  );
}