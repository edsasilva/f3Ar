import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-title>F3AR System</mat-card-title>
        <mat-card-content>
          <form (ngSubmit)="onLogin()">
            <mat-form-field appearance="fill">
              <mat-label>Usuário</mat-label>
              <input
                matInput
                [(ngModel)]="username"
                name="username"
                placeholder="Digite o usuário"
              />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Senha</mat-label>
              <input
                matInput
                [(ngModel)]="password"
                name="password"
                type="password"
                placeholder="Digite a senha"
              />
            </mat-form-field>

            <div class="error" *ngIf="error()">{{ error() }}</div>

            <button mat-raised-button color="primary" type="submit">
              Entrar
            </button>
          </form>
          <div class="hint">
            <p><strong>Teste:</strong> admin / admin123</p>
          </div>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    mat-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    mat-card-title {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }

    button {
      width: 100%;
      margin-top: 1rem;
    }

    .error {
      color: #d32f2f;
      margin: 1rem 0;
      text-align: center;
    }

    .hint {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #ddd;
      font-size: 0.9rem;
      text-align: center;
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
      this.error.set('Preencha todos os campos');
      return;
    }

    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Usuário ou senha inválidos');
      this.password = '';
    }
  }
}
