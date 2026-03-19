const API_BASE = 'http://localhost:8080/api';

export default class AuthenticationService {
  static isAuthenticated = false;
  static userId: string | null = null;

  static async login(username: string, password: string): Promise<boolean> {
    console.log('Attempting login with:', { username, password });
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data: { success: boolean; user_id?: string } = await response.json();
      console.log('Login response:', data);
      this.isAuthenticated = data.success;
      this.userId = data.success ? data.user_id || null : null;
      return data.success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }
}
