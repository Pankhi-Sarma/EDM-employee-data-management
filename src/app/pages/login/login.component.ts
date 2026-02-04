import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Moon, Sun, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="login-container">
      <button 
        (click)="toggleTheme()" 
        class="theme-toggle"
        aria-label="Toggle theme">
        <lucide-icon [img]="isDarkMode ? Sun : Moon" [size]="18"></lucide-icon>
      </button>

      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Employee Dashboard</h1>
          <p class="login-subtitle">Sign in to continue</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input 
              id="username"
              type="text" 
              [(ngModel)]="username" 
              name="username" 
              required
              class="form-input"
              placeholder="Enter username"
              [class.error]="error">
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-wrapper">
              <input 
                id="password"
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="password" 
                required
                class="form-input"
                placeholder="Enter password"
                [class.error]="error">
              <button 
                type="button"
                (click)="togglePasswordVisibility()"
                class="password-toggle"
                tabindex="-1"
                aria-label="Toggle password visibility">
                <lucide-icon [img]="showPassword ? EyeOff : Eye" [size]="16"></lucide-icon>
              </button>
            </div>
          </div>

          <div *ngIf="error" class="error-message">{{ error }}</div>

          <button type="submit" class="submit-button">Sign In</button>
        </form>

        <div class="demo-info">
          <span>Demo: <strong>Newuser</strong> / <strong>123456</strong></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
                  url('/login-bg.png') center/cover no-repeat;
      position: relative;
    }

    :host-context(.dark) .login-container {
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                  url('/login-bg.png') center/cover no-repeat;
    }

    .theme-toggle {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 100;
      color: white;
    }

    .theme-toggle:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    :host-context(.dark) .login-card {
      background: #1e293b;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .login-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }

    :host-context(.dark) .login-title {
      color: #f1f5f9;
    }

    .login-subtitle {
      font-size: 0.875rem;
      color: #64748b;
    }

    :host-context(.dark) .login-subtitle {
      color: #94a3b8;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
    }

    :host-context(.dark) .form-label {
      color: #cbd5e1;
    }

    .password-wrapper {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: 0.625rem 0.875rem;
      font-size: 0.9375rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: white;
      color: #1e293b;
      transition: all 0.2s;
      outline: none;
    }

    :host-context(.dark) .form-input {
      background: #0f172a;
      border-color: #334155;
      color: #f1f5f9;
    }

    .form-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    :host-context(.dark) .form-input:focus {
      border-color: #818cf8;
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #64748b;
      display: flex;
      align-items: center;
      padding: 0.25rem;
      transition: color 0.2s;
    }

    .password-toggle:hover {
      color: #667eea;
    }

    :host-context(.dark) .password-toggle {
      color: #94a3b8;
    }

    :host-context(.dark) .password-toggle:hover {
      color: #818cf8;
    }

    .error-message {
      padding: 0.625rem 0.875rem;
      background: #fee2e2;
      border-radius: 6px;
      color: #dc2626;
      font-size: 0.8125rem;
      text-align: center;
    }

    :host-context(.dark) .error-message {
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.25rem;
    }

    .submit-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .submit-button:active {
      transform: translateY(0);
    }

    .demo-info {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 0.8125rem;
      color: #64748b;
    }

    :host-context(.dark) .demo-info {
      border-top-color: #334155;
      color: #94a3b8;
    }

    .demo-info strong {
      color: #667eea;
      font-weight: 600;
    }

    :host-context(.dark) .demo-info strong {
      color: #818cf8;
    }

    @media (max-width: 640px) {
      .login-card {
        padding: 1.5rem;
      }

      .theme-toggle {
        top: 1rem;
        right: 1rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  showPassword = false;
  isDarkMode = false;
  Moon = Moon;
  Sun = Sun;
  Eye = Eye;
  EyeOff = EyeOff;

  constructor(private router: Router) { }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.error = '';

    if (this.username === 'Newuser' && this.password === '123456') {
      localStorage.setItem('auth_session', JSON.stringify({
        isAuthenticated: true,
        username: this.username
      }));
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid username or password. Please try again.';
    }
  }
}
