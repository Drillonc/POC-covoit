const API_BASE = 'http://localhost:8080/api';

export default class AuthenticationService {
  static isAuthenticated = false;
  static userId: string | null = null;
  static token: string | null = null;

  static getAuthHeaders() {
    const token = localStorage.getItem('capcovoit-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async login(email: string, password: string): Promise<{ success: boolean; fullName?: string }> {
    console.log('Attempting login with:', { email, password });
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: { success: boolean; user_id?: string; fullName?: string; token?: string } = await response.json();
      console.log('Login response:', data);
      
      this.isAuthenticated = data.success;
      this.userId = data.success ? data.user_id || null : null;
      
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('capcovoit-token', data.token);
        localStorage.setItem('capcovoit-user', data.user_id || '');
      }
      
      return { success: data.success, fullName: data.fullName };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  }

  static async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<boolean> {
    console.log('Attempting register with:', { email, firstName, lastName, password });
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, firstName, lastName, password })
      });

      if (!response.ok) {
        return false;
      }

      const data: { success: boolean; token?: string; user_id?: string } = await response.json();
      console.log('Register response:', data);
      
      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('capcovoit-token', data.token);
        localStorage.setItem('capcovoit-user', email);
        this.isAuthenticated = true;
        this.userId = email;
      }
      
      return data.success;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }

  static logout() {
    this.isAuthenticated = false;
    this.userId = null;
    this.token = null;
    localStorage.removeItem('capcovoit-token');
    localStorage.removeItem('capcovoit-user');
  }
}
