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
}

export default class RideService {
  static getAuthHeaders() {
    const token = localStorage.getItem('capcovoit-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getAllRides(): Promise<Ride[]> {
    const response = await fetch(`${API_BASE}/rides`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch rides');
    return response.json();
  }

  static async getMyRides(): Promise<Ride[]> {
    const response = await fetch(`${API_BASE}/rides/my`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch my rides');
    return response.json();
  }

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

  static async deleteRide(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rides/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete ride');
  }

  static async joinRide(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rides/${id}/join`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to join ride');
  }

  static async leaveRide(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rides/${id}/join`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to leave ride');
  }
}