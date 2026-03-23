const API_BASE = 'http://localhost:8080/api';

export default class AuthenticationService {
  static isAuthenticated = false;
  static userId: string | null = null;

  static async login(username: string, password: string): Promise<{ success: boolean; fullName?: string }> {
    console.log('Attempting login with:', { username, password });
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data: { success: boolean; user_id?: string; fullName?: string } = await response.json();
      console.log('Login response:', data);
      this.isAuthenticated = data.success;
      this.userId = data.success ? data.user_id || null : null;
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

      const data: { success: boolean } = await response.json();
      console.log('Register response:', data);
      return data.success;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }
}
