import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card elevation-z8">
        <div class="login-header">
          <mat-icon class="login-icon">lock</mat-icon>
          <mat-card-title>F3AR System</mat-card-title>
          <mat-card-subtitle>Welcome! Please log in.</mat-card-subtitle>
        </div>

        <mat-card-content>
          <form (ngSubmit)="onLogin()" class="login-form">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input
                matInput
                [(ngModel)]="username"
                name="username"
                placeholder="Username"
                required
              />
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                [(ngModel)]="password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
              <mat-icon matPrefix>key</mat-icon>
            </mat-form-field>

            <div class="error-message" *ngIf="error()">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error() }}</span>
            </div>

            <button mat-raised-button type="submit" class="login-button" color="primary">
              Login
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-image: url('./public/bg.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .login-card {
      width: 90%;
      max-width: 420px;
      padding: 2.5rem 1.5rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
      color: white;
    }

    .login-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 1rem;
      color: white;
    }

    mat-card-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: white;
    }

    mat-card-subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 0.5rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .login-button {
      width: 100%;
      padding: 1.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      margin-top: 1.5rem;
      height: 56px;
      background-color: white !important;
      color: #0f172a !important;
      font-weight: 700;
    }

    .error-message {
      background-color: rgba(220, 38, 38, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(220, 38, 38, 0.2);
      padding: 0.75rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .error-message mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Overrides para Material Form Fields em modo escuro/branco */
    :host ::ng-deep {
      .mat-mdc-form-field-label mat-label {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      .mat-mdc-input-element {
        color: white !important;
        caret-color: white !important;
      }
      .mat-mdc-form-field-icon-prefix {
        color: white !important;
      }
      .mdc-notched-outline__leading,
      .mdc-notched-outline__notch,
      .mdc-notched-outline__trailing {
        border-color: rgba(255, 255, 255, 0.3) !important;
      }
      .mat-mdc-form-field.mat-focused {
        .mdc-notched-outline__leading,
        .mdc-notched-outline__notch,
        .mdc-notched-outline__trailing {
          border-color: white !important;
        }
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Invalid username or password');
      this.password = '';
    }
  }
}
