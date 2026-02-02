import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background px-4">
      <div class="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-foreground">EDM Dashboard</h2>
          <p class="mt-2 text-sm text-muted-foreground">Sign in to manage your team</p>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Username</label>
              <input type="text" [(ngModel)]="username" name="username" required
                class="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:ring-primary focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required
                class="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:ring-primary focus:border-primary">
            </div>
          </div>
          <div *ngIf="error" class="text-destructive text-sm text-center font-medium">
            {{ error }}
          </div>
          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
            Sign In
          </button>
        </form>
        <div class="text-center text-xs text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Newuser / 123456</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router) { }

  onSubmit() {
    if (this.username === 'Newuser' && this.password === '123456') {
      localStorage.setItem('auth_session', JSON.stringify({ isAuthenticated: true, username: this.username }));
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid username or password';
    }
  }
}
