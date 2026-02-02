import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

const authGuard = () => {
    const router = inject(Router);
    const session = localStorage.getItem('auth_session');
    if (session) {
        const auth = JSON.parse(session);
        if (auth.isAuthenticated) return true;
    }
    return router.parseUrl('/');
};

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
