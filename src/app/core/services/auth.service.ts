import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal(false);
  currentUser = signal<{ username: string; role: 'admin' | 'visitor' } | null>(null);

  private readonly VALID_USERNAME = 'f3ar';
  private readonly VALID_PASSWORD = 'panda';

  private readonly VISITOR_USERNAME = 'visitor';
  private readonly VISITOR_PASSWORD = 'f3ar';

  login(username: string, password: string): boolean {
    if (username === this.VALID_USERNAME && password === this.VALID_PASSWORD) {
      this.isAuthenticated.set(true);
      this.currentUser.set({ username, role: 'admin' });
      return true;
    }

    if (username === this.VISITOR_USERNAME && password === this.VISITOR_PASSWORD) {
      this.isAuthenticated.set(true);
      this.currentUser.set({ username, role: 'visitor' });
      return true;
    }

    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
