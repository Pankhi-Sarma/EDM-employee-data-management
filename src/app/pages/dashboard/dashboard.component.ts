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
    <div class="min-h-screen bg-background">
      <!-- Header -->
      <header class="border-b border-border bg-card sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-primary p-2">
                <i-lucide name="users" class="h-5 w-5 text-primary-foreground"></i-lucide>
              </div>
              <div>
                <h1 class="text-xl font-bold text-foreground">Employee Dashboard</h1>
                <p class="text-sm text-muted-foreground">Welcome back</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button (click)="logout()" class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <i-lucide name="log-out" class="h-4 w-4"></i-lucide>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Actions Bar -->
        <div class="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <div class="relative max-w-sm">
              <i-lucide name="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"></i-lucide>
              <input type="text" [(ngModel)]="filterConfig.searchQuery" (input)="onFilterChange()"
                placeholder="Search name or email..."
                class="bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm w-full focus:ring-primary focus:border-primary">
            </div>
            <select [(ngModel)]="filterConfig.department" (change)="onFilterChange()"
              class="bg-background border border-border rounded-md px-4 py-2 text-sm focus:ring-primary focus:border-primary">
              <option value="all">All Departments</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button (click)="exportCSV()" class="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
              <i-lucide name="download" class="h-4 w-4"></i-lucide>
              <span>Export CSV</span>
            </button>
            <button (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              <i-lucide name="plus" class="h-4 w-4"></i-lucide>
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table class="min-w-full divide-y divide-border">
            <thead class="bg-muted/50">
              <tr>
                <th (click)="toggleSort('name')" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors">
                  <div class="flex items-center gap-2">
                    Name <i-lucide name="arrow-up-down" class="h-3 w-3"></i-lucide>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ emp.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">{{ emp.department }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ emp.dateOfJoining }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <button (click)="openEditModal(emp)" class="p-1 hover:text-primary transition-colors">
                      <i-lucide name="edit-2" class="h-4 w-4"></i-lucide>
                    </button>
                    <button (click)="deleteEmployee(emp)" class="p-1 hover:text-destructive transition-colors">
                      <i-lucide name="trash-2" class="h-4 w-4"></i-lucide>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredEmployees.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-muted-foreground">
                  No employees found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div class="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 scale-in-center">
            <h3 class="text-lg font-bold mb-4">{{ editingEmployee ? 'Edit' : 'Add' }} Employee</h3>
            <form [formGroup]="employeeForm" (ngSubmit)="onModalSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Name</label>
                <input type="text" formControlName="name" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                <p *ngIf="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched" class="text-destructive text-xs mt-1">Name must be at least 3 characters</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" formControlName="email" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                <p *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched" class="text-destructive text-xs mt-1">Please enter a valid email</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Department</label>
                <select formControlName="department" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Date of Joining</label>
                <input type="date" formControlName="dateOfJoining" [max]="today" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                <p *ngIf="employeeForm.get('dateOfJoining')?.invalid && employeeForm.get('dateOfJoining')?.touched" class="text-destructive text-xs mt-1">Future dates are not allowed</p>
              </div>
              <div class="flex justify-end gap-3 mt-6">
                <button type="button" (click)="showModal = false" class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">Cancel</button>
                <button type="submit" [disabled]="employeeForm.invalid" class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {{ editingEmployee ? 'Save' : 'Add' }}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  sortConfig: SortConfig = { field: 'name', direction: 'asc' };
  filterConfig: FilterConfig = { department: 'all', searchQuery: '' };

  showModal = false;
  editingEmployee: Employee | null = null;
  employeeForm: FormGroup;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['HR', Validators.required],
      dateOfJoining: ['', [Validators.required, noFutureDateValidator()]]
    });
  }

  ngOnInit() {
    this.employeeService.getEmployees$().subscribe(emps => {
      this.employees = emps;
      this.applyTransformation();
    });
  }

  onFilterChange() {
    this.applyTransformation();
  }

  toggleSort(field: 'name' | 'dateOfJoining') {
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
    this.employeeForm.reset({ department: 'HR' });
    this.showModal = true;
  }

  openEditModal(emp: Employee) {
    this.editingEmployee = emp;
    this.employeeForm.patchValue(emp);
    this.showModal = true;
  }

  onModalSubmit() {
    if (this.employeeForm.valid) {
      if (this.editingEmployee) {
        this.employeeService.updateEmployee(this.editingEmployee.id, this.employeeForm.value);
      } else {
        this.employeeService.addEmployee(this.employeeForm.value);
      }
      this.showModal = false;
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

  logout() {
    localStorage.removeItem('auth_session');
    this.router.navigate(['/']);
  }
}
