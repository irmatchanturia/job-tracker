import { Injectable, signal } from '@angular/core';

interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userKey = 'jobtrack_user';
  private readonly tokenKey = 'jobtrack_token';

  isLoggedIn = signal<boolean>(!!localStorage.getItem(this.tokenKey));

  register(user: User): boolean {
    const existingUser = localStorage.getItem(this.userKey);

    if (existingUser) {
      const parsedUser: User = JSON.parse(existingUser);

      if (parsedUser.email === user.email) {
        return false;
      }
    }

    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, 'demo-token');

    this.isLoggedIn.set(true);

    return true;
  }
  login(email: string, password: string): boolean {
    const storedUser = localStorage.getItem(this.userKey);

    if (!storedUser) {
      return false;
    }

    const user: User = JSON.parse(storedUser);

    if (user.email !== email || user.password !== password) {
      return false;
    }

    localStorage.setItem(this.tokenKey, 'demo-token');
    this.isLoggedIn.set(true);

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
