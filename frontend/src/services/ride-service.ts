const API_BASE = 'http://localhost:8080/api';

export interface Ride {
  id: number;
  start: string;
  end: string;
  seats: number;
  date: string;
  driver: {
    email: string;
    firstName: string;
    lastName: string;
  };
  isDriver: boolean;
  joined: boolean;
  isPassed: boolean;
  passengers: {
    email: string;
    firstName: string;
    lastName: string;
  }[];
}

/*
 * Nom de classe : RideService
 * Description   : Service pour gérer les opérations liées aux trajets, y compris la récupération de tous les trajets, la création, la suppression, l'inscription et le désinscription.
 *
 */
export default class RideService {
  static getAuthHeaders() {
    const token = localStorage.getItem('capcovoit-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Méthode pour récupérer tous les trajets disponibles
  static async getAllRides(): Promise<Ride[]> {
    const response = await fetch(`${API_BASE}/rides`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch rides');
    return response.json();
  }

  // Méthode pour récupérer les trajets créés par l'utilisateur
  static async getMyRides(): Promise<Ride[]> {
    const response = await fetch(`${API_BASE}/rides/my`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch my rides');
    return response.json();
  }

  // Méthode pour récupérer les trajets auxquels l'utilisateur est inscrit
  static async getJoinedRides(): Promise<Ride[]> {
    const response = await fetch(`${API_BASE}/rides/joined`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch joined rides');
    return response.json();
  }


  // Méthode pour récupérer les trajets auxquels l'utilisateur a participé et qui sont passés
  static async getPassedRides(): Promise<Ride[]> {
    const response = await fetch(`${API_BASE}/rides/passed`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch passed rides');
    return response.json();
  }

  // Méthode pour créer un nouveau trajet
  static async createRide(start: string, end: string, seats: number, date: string): Promise<Ride> {
    const response = await fetch(`${API_BASE}/rides`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ start, end, seats, date })
    });

    if (!response.ok) throw new Error('Failed to create ride');

    const data = await response.json();
    return data.ride;
  }

  // Méthode pour supprimer un trajet
  static async deleteRide(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rides/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete ride');
  }

  // Méthode pour s'inscrire à un trajet
  static async joinRide(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rides/${id}/join`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to join ride');
  }

  // Méthode pour se désinscrire d'un trajet
  static async leaveRide(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rides/${id}/join`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to leave ride');
  }
}