import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal(false);
  currentUser = signal<{ username: string } | null>(null);

  private readonly VALID_USERNAME = 'admin';
  private readonly VALID_PASSWORD = 'admin123';

  login(username: string, password: string): boolean {
    if (username === this.VALID_USERNAME && password === this.VALID_PASSWORD) {
      this.isAuthenticated.set(true);
      this.currentUser.set({ username });
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
