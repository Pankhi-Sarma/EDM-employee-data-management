import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, Department, SortConfig, FilterConfig } from '../../models/employee.model';
import { LucideAngularModule, Users, LogOut, Plus, Download, Edit2, Trash2, Search, ArrowUpDown } from 'lucide-angular';
import { noFutureDateValidator } from '../../validators/date.validator';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <!-- Professional Header with Gradient -->
      <header class="bg-gradient-to-r from-primary to-primary/80 shadow-lg border-b border-primary/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo and Title Section -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-lg border border-primary-foreground/30 flex items-center justify-center overflow-hidden">
                <img src="/EDM.png" alt="EDM Logo" class="w-full h-full object-contain">
              </div>
              <div>
                <h1 class="text-lg font-bold text-primary-foreground">Employee Dashboard Management</h1>
                <p class="text-xs text-primary-foreground/80">Welcome back, {{ username }}</p>
              </div>
            </div>
            
            <!-- Header Actions -->
            <div class="flex items-center gap-2">
              <button (click)="toggleDarkMode()" class="p-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 backdrop-blur-sm rounded-lg transition-all border border-primary-foreground/30 text-primary-foreground" title="Toggle Dark Mode">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              </button>
              <button (click)="logout()" class="flex items-center gap-2 px-3 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 backdrop-blur-sm rounded-lg transition-all border border-primary-foreground/30 text-primary-foreground text-sm font-medium">
                <i-lucide name="log-out" class="h-4 w-4"></i-lucide>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <!-- Total Employees Card - Sky Blue -->
          <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all border border-sky-400/20">
            <div class="flex items-center justify-between mb-2">
              <div class="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <i-lucide name="users" class="h-5 w-5"></i-lucide>
              </div>
            </div>
            <p class="text-2xl font-bold mb-0.5">{{ employees.length }}</p>
            <p class="text-sky-50 text-xs font-medium">Total Employees</p>
          </div>

          <!-- Active Employees Card - Deep Blue -->
          <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all border border-blue-500/20">
            <div class="flex items-center justify-between mb-2">
              <div class="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold mb-0.5">{{ activeEmployeesCount }}</p>
            <p class="text-blue-100 text-xs font-medium">Active Employees</p>
          </div>

          <!-- Departments Card - Indigo -->
          <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all border border-indigo-400/20">
            <div class="flex items-center justify-between mb-2">
              <div class="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold mb-0.5">4</p>
            <p class="text-indigo-100 text-xs font-medium">Departments</p>
          </div>

          <!-- On Leave Card - Navy Blue -->
          <div class="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all border border-blue-700/20">
            <div class="flex items-center justify-between mb-2">
              <div class="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold mb-0.5">{{ onLeaveEmployeesCount }}</p>
            <p class="text-blue-100 text-xs font-medium">On Leave</p>
          </div>
        </div>

        <!-- Filters and Actions Section -->
        <div class="bg-card border border-border rounded-xl shadow-md mb-6 overflow-hidden">
          <div class="bg-gradient-to-r from-muted/50 to-muted/30 px-5 py-3 border-b border-border">
            <h2 class="text-base font-semibold text-foreground">Employee Management</h2>
            <p class="text-xs text-muted-foreground mt-0.5">Search, filter, and manage your team</p>
          </div>
          
          <div class="p-5">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <!-- Search -->
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-foreground mb-1.5">Search Employees</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i-lucide name="search" class="h-4 w-4 text-muted-foreground"></i-lucide>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="filterConfig.searchQuery"
                    (ngModelChange)="onFilterChange()"
                    placeholder="Search by name, email, phone, or position..."
                    class="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                </div>
              </div>

              <!-- Department Filter -->
              <div>
                <label class="block text-xs font-medium text-foreground mb-1.5">Department</label>
                <select
                  [(ngModel)]="filterConfig.department"
                  (ngModelChange)="onFilterChange()"
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="all">All Departments</option>
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <!-- Status Filter -->
              <div>
                <label class="block text-xs font-medium text-foreground mb-1.5">Status</label>
                <select
                  [(ngModel)]="filterConfig.status"
                  (ngModelChange)="onFilterChange()"
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <button
                (click)="openAddModal()"
                class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              >
                <i-lucide name="plus" class="h-4 w-4"></i-lucide>
                <span>Add Employee</span>
              </button>
              <button
                (click)="exportCSV()"
                [disabled]="filteredEmployees.length === 0"
                class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                <i-lucide name="download" class="h-4 w-4"></i-lucide>
                <span>Export CSV</span>
              </button>
              <div class="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <span class="font-medium">Showing {{ filteredEmployees.length }} of {{ employees.length }} employees</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-card border border-border rounded-xl overflow-hidden shadow-sm overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead class="bg-muted/50">
              <tr>
                <th (click)="toggleSort('name')" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors">
                  <div class="flex items-center gap-2">
                    Name <i-lucide name="arrow-up-down" class="h-3 w-3"></i-lucide>
                  </div>
                </th>
                <th (click)="toggleSort('position')" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors">
                  <div class="flex items-center gap-2">
                    Position <i-lucide name="arrow-up-down" class="h-3 w-3"></i-lucide>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th (click)="toggleSort('dateOfJoining')" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors">
                  <div class="flex items-center gap-2">
                    Join Date <i-lucide name="arrow-up-down" class="h-3 w-3"></i-lucide>
                  </div>
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border bg-card">
              <tr *ngFor="let emp of filteredEmployees" class="hover:bg-muted/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{{ emp.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ emp.position }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ emp.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">{{ emp.department }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': emp.status === 'Active',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': emp.status === 'On Leave',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': emp.status === 'Probation',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': emp.status === 'Terminated'
                  }" class="px-2 py-1 text-xs rounded-full font-medium">{{ emp.status }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ emp.dateOfJoining }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <button (click)="viewEmployee(emp)" class="p-1 text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="View Details">
                      <i-lucide name="info" class="h-4 w-4"></i-lucide>
                    </button>
                    <button (click)="openEditModal(emp)" class="p-1 text-foreground hover:text-primary transition-colors" title="Edit">
                      <i-lucide name="edit-2" class="h-4 w-4"></i-lucide>
                    </button>
                    <button (click)="deleteEmployee(emp)" class="p-1 text-foreground hover:text-destructive transition-colors" title="Delete">
                      <i-lucide name="trash-2" class="h-4 w-4"></i-lucide>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredEmployees.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-muted-foreground">
                  No employees found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div class="bg-card w-full max-w-3xl rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-border bg-muted/30">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-foreground">{{ editingEmployee ? 'Edit' : 'Add New' }} Employee</h3>
                <p class="text-sm text-muted-foreground mt-1">{{ editingEmployee ? 'Update employee information' : 'Fill in the details to add a new employee' }}</p>
              </div>
              <button type="button" (click)="showModal = false" class="text-muted-foreground hover:text-foreground transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto px-6 py-6">
            <form [formGroup]="employeeForm" (ngSubmit)="onModalSubmit()" id="employeeForm" class="space-y-6">
              <!-- Personal Information Section -->
              <div>
                <h4 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Personal Information
                </h4>
                
                <!-- Photo Upload -->
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-2 text-foreground">Employee Photo</label>
                  <div class="flex items-center gap-4">
                    <div class="w-24 h-24 rounded-xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                      <img *ngIf="photoPreview" [src]="photoPreview" alt="Employee Photo" class="w-full h-full object-cover">
                      <svg *ngIf="!photoPreview" class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <input type="file" #fileInput (change)="onPhotoSelected($event)" accept="image/*" class="hidden">
                      <button type="button" (click)="fileInput.click()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
                        Choose Photo
                      </button>
                      <button type="button" *ngIf="photoPreview" (click)="removePhoto()" class="ml-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-all">
                        Remove
                      </button>
                      <p class="text-xs text-muted-foreground mt-2">Upload a profile photo (JPG, PNG, max 2MB)</p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Full Name</label>
                    <input type="text" formControlName="name" placeholder="Employee Name" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched" class="text-destructive text-xs mt-1.5">Name must be at least 3 characters</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                    <input type="email" formControlName="email" placeholder="employee@company.com" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched" class="text-destructive text-xs mt-1.5">Please enter a valid email</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Phone Number</label>
                    <input type="tel" formControlName="phone" placeholder="Enter 10 digit number" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('phone')?.invalid && employeeForm.get('phone')?.touched" class="text-destructive text-xs mt-1.5">Phone must be 10 digits</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Address</label>
                    <input type="text" formControlName="address" placeholder="Enter complete address" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('address')?.invalid && employeeForm.get('address')?.touched" class="text-destructive text-xs mt-1.5">Address must be at least 10 characters</p>
                  </div>
                </div>
              </div>

              <!-- Employment Details Section -->
              <div>
                <h4 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Employment Details
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Position</label>
                    <select formControlName="position" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                      <option value="">Select Position</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Senior Software Engineer">Senior Software Engineer</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="HR Executive">HR Executive</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Marketing Executive">Marketing Executive</option>
                      <option value="Business Analyst">Business Analyst</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="QA Engineer">QA Engineer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Intern">Intern</option>
                    </select>
                    <p *ngIf="employeeForm.get('position')?.invalid && employeeForm.get('position')?.touched" class="text-destructive text-xs mt-1.5">Position is required</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Department</label>
                    <select formControlName="department" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                      <option value="HR">HR</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Status</label>
                    <select formControlName="status" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Probation">Probation</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Date of Joining</label>
                    <input type="date" formControlName="dateOfJoining" [max]="today" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('dateOfJoining')?.invalid && employeeForm.get('dateOfJoining')?.touched" class="text-destructive text-xs mt-1.5">Future dates are not allowed</p>
                  </div>
                </div>
              </div>

              <!-- Compensation & Leave Section -->
              <div>
                <h4 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span class="text-base font-bold">₹</span>
                  Compensation & Leave
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Annual Salary</label>
                    <div class="relative">
                      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input type="number" formControlName="salary" placeholder="Enter annual salary" class="w-full bg-background border border-border rounded-lg pl-8 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    </div>
                    <p *ngIf="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched" class="text-destructive text-xs mt-1.5">Salary must be a positive number</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Vacation Days</label>
                    <input type="number" formControlName="vacationDays" min="0" max="365" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('vacationDays')?.invalid && employeeForm.get('vacationDays')?.touched" class="text-destructive text-xs mt-1.5">Must be between 0-365</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-foreground">Sick Leave Days</label>
                    <input type="number" formControlName="sickLeaveDays" min="0" max="365" class="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <p *ngIf="employeeForm.get('sickLeaveDays')?.invalid && employeeForm.get('sickLeaveDays')?.touched" class="text-destructive text-xs mt-1.5">Must be between 0-365</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
            <button type="button" (click)="showModal = false" class="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" form="employeeForm" [disabled]="employeeForm.invalid" class="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
              {{ editingEmployee ? 'Save Changes' : 'Add Employee' }}
            </button>
          </div>
        </div>
      </div>

      <!-- View Employee Modal - ID Card Style -->
      <div *ngIf="showViewModal && viewingEmployee" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div class="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border-2 border-primary/20 max-h-[90vh] overflow-hidden flex flex-col">
          <!-- ID Card Header with Gradient -->
          <div class="relative bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-primary-foreground">
            <button type="button" (click)="showViewModal = false" class="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div class="flex items-start gap-6">
              <!-- Employee Photo -->
              <div class="flex-shrink-0">
                <div class="w-32 h-32 rounded-xl bg-primary-foreground/20 border-4 border-primary-foreground/30 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                  <img *ngIf="viewingEmployee.photo" [src]="viewingEmployee.photo" alt="{{ viewingEmployee.name }}" class="w-full h-full object-cover">
                  <svg *ngIf="!viewingEmployee.photo" class="w-16 h-16 text-primary-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Employee Header Info -->
              <div class="flex-1 pt-2">
                <h2 class="text-3xl font-bold mb-2">{{ viewingEmployee.name }}</h2>
                <p class="text-xl text-primary-foreground/90 mb-3">{{ viewingEmployee.position }}</p>
                <div class="flex flex-wrap gap-3">
                  <span class="px-3 py-1 bg-primary-foreground/20 backdrop-blur-sm rounded-full text-sm font-medium border border-primary-foreground/30">
                    {{ viewingEmployee.department }}
                  </span>
                  <span [ngClass]="{
                    'bg-green-500/90 border-green-300': viewingEmployee.status === 'Active',
                    'bg-yellow-500/90 border-yellow-300': viewingEmployee.status === 'On Leave',
                    'bg-blue-500/90 border-blue-300': viewingEmployee.status === 'Probation',
                    'bg-red-500/90 border-red-300': viewingEmployee.status === 'Terminated'
                  }" class="px-3 py-1 backdrop-blur-sm rounded-full text-sm font-medium border text-white">
                    {{ viewingEmployee.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ID Card Body -->
          <div class="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-muted/30 to-background">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <!-- Contact Information Card -->
                <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Contact Information
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-muted-foreground mb-1">Email</p>
                      <p class="text-sm font-medium text-foreground break-all">{{ viewingEmployee.email }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground mb-1">Phone</p>
                      <p class="text-sm font-medium text-foreground">{{ viewingEmployee.phone }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground mb-1">Address</p>
                      <p class="text-sm font-medium text-foreground">{{ viewingEmployee.address }}</p>
                    </div>
                  </div>
                </div>

                <!-- Employment Details Card -->
                <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Employment Details
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-muted-foreground mb-1">Employee ID</p>
                      <p class="text-sm font-medium text-foreground font-mono">{{ viewingEmployee.id }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground mb-1">Date of Joining</p>
                      <p class="text-sm font-medium text-foreground">{{ viewingEmployee.dateOfJoining }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <!-- Compensation Card -->
                <div class="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
                  <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span class="text-base font-bold">₹</span>
                    Compensation
                  </h3>
                  <div class="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                    <p class="text-xs text-muted-foreground mb-1">Annual Salary</p>
                    <p class="text-2xl font-bold text-primary">₹ {{ viewingEmployee.salary | number }}</p>
                    <p class="text-xs text-muted-foreground mt-1">Per Year</p>
                  </div>
                </div>

                <!-- Leave Balance Card -->
                <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Leave Balance
                  </h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <p class="text-xs text-blue-600 dark:text-blue-400 mb-1">Vacation</p>
                      <p class="text-xl font-bold text-blue-700 dark:text-blue-300">{{ viewingEmployee.vacationDays }}</p>
                      <p class="text-xs text-blue-600 dark:text-blue-400">days</p>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <p class="text-xs text-green-600 dark:text-green-400 mb-1">Sick Leave</p>
                      <p class="text-xl font-bold text-green-700 dark:text-green-300">{{ viewingEmployee.sickLeaveDays }}</p>
                      <p class="text-xs text-green-600 dark:text-green-400">days</p>
                    </div>
                  </div>
                </div>

                <!-- Quick Actions Card -->
                <div class="bg-muted/50 border border-border rounded-xl p-4">
                  <p class="text-xs text-muted-foreground mb-3">Quick Actions</p>
                  <div class="flex gap-2">
                    <button type="button" (click)="editFromView()" class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm">
                      Edit Details
                    </button>
                    <button type="button" (click)="showViewModal = false" class="px-4 py-2 bg-background border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  sortConfig: SortConfig = { field: 'name', direction: 'asc' };
  filterConfig: FilterConfig = { department: 'all', status: 'all', searchQuery: '' };

  showModal = false;
  showViewModal = false;
  editingEmployee: Employee | null = null;
  viewingEmployee: Employee | null = null;
  employeeForm: FormGroup;
  today = new Date().toISOString().split('T')[0];
  username = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      position: ['', [Validators.required, Validators.minLength(2)]],
      department: ['HR', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      status: ['Active', Validators.required],
      dateOfJoining: ['', [Validators.required, noFutureDateValidator()]],
      vacationDays: [20, [Validators.required, Validators.min(0), Validators.max(365)]],
      sickLeaveDays: [10, [Validators.required, Validators.min(0), Validators.max(365)]]
    });
  }

  ngOnInit() {
    const authSession = localStorage.getItem('auth_session');
    if (authSession) {
      const session = JSON.parse(authSession);
      this.username = session.username || 'User';
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.employeeService.getEmployees$().subscribe(emps => {
      this.employees = emps;
      this.applyTransformation();
    });
  }

  onFilterChange() {
    this.applyTransformation();
  }

  toggleSort(field: 'name' | 'dateOfJoining' | 'position' | 'salary') {
    if (this.sortConfig.field === field) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.field = field;
      this.sortConfig.direction = 'asc';
    }
    this.applyTransformation();
  }

  applyTransformation() {
    let result = this.employeeService.filterEmployees(this.employees, this.filterConfig);
    this.filteredEmployees = this.employeeService.sortEmployees(result, this.sortConfig);
  }

  openAddModal() {
    this.editingEmployee = null;
    this.photoPreview = null;
    this.employeeForm.reset({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: 'HR',
      salary: 0,
      address: '',
      status: 'Active',
      dateOfJoining: this.today,
      vacationDays: 15,
      sickLeaveDays: 10
    });
    this.showModal = true;
  }

  openEditModal(emp: Employee) {
    this.editingEmployee = emp;
    this.photoPreview = emp.photo || null;
    this.employeeForm.patchValue(emp);
    this.showModal = true;
  }

  onModalSubmit() {
    if (this.employeeForm.valid) {
      const formData = { ...this.employeeForm.value, photo: this.photoPreview };
      if (this.editingEmployee) {
        this.employeeService.updateEmployee(this.editingEmployee.id, formData);
      } else {
        this.employeeService.addEmployee(formData);
      }
      this.showModal = false;
      this.photoPreview = null;
    }
  }

  deleteEmployee(emp: Employee) {
    if (confirm(`Are you sure you want to delete ${emp.name}?`)) {
      this.employeeService.deleteEmployee(emp.id);
    }
  }

  exportCSV() {
    this.employeeService.exportToCSV(this.filteredEmployees);
  }

  viewEmployee(emp: Employee) {
    this.viewingEmployee = emp;
    this.showViewModal = true;
  }

  editFromView() {
    if (this.viewingEmployee) {
      this.showViewModal = false;
      this.openEditModal(this.viewingEmployee);
    }
  }

  logout() {
    localStorage.removeItem('auth_session');
    this.router.navigate(['/']);
  }

  get activeEmployeesCount(): number {
    return this.employees.filter(e => e.status === 'Active').length;
  }

  get onLeaveEmployeesCount(): number {
    return this.employees.filter(e => e.status === 'On Leave').length;
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Read and preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.photoPreview = null;
  }
}
