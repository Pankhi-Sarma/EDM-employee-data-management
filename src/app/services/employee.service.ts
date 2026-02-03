import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, Department, SortConfig, FilterConfig } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private readonly STORAGE_KEY = 'employees';
    private employeesSubject = new BehaviorSubject<Employee[]>([]);

    constructor() {
        this.loadEmployees();
    }

    getEmployees$(): Observable<Employee[]> {
        return this.employeesSubject.asObservable();
    }

    private loadEmployees(): void {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const employees = data ? JSON.parse(data) : [];
            this.employeesSubject.next(employees);
        } catch (e) {
            this.employeesSubject.next([]);
        }
    }

    private saveEmployees(employees: Employee[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
        this.employeesSubject.next(employees);
    }

    addEmployee(employee: Omit<Employee, 'id'>): void {
        const employees = this.employeesSubject.value;
        const newEmployee: Employee = {
            ...employee,
            id: crypto.randomUUID()
        };
        this.saveEmployees([...employees, newEmployee]);
    }

    updateEmployee(id: string, data: Partial<Employee>): void {
        const employees = this.employeesSubject.value;
        const index = employees.findIndex(e => e.id === id);
        if (index !== -1) {
            const updatedEmployees = [...employees];
            updatedEmployees[index] = { ...updatedEmployees[index], ...data };
            this.saveEmployees(updatedEmployees);
        }
    }

    deleteEmployee(id: string): void {
        const employees = this.employeesSubject.value;
        this.saveEmployees(employees.filter(e => e.id !== id));
    }

    sortEmployees(employees: Employee[], config: SortConfig): Employee[] {
        return [...employees].sort((a, b) => {
            let comparison = 0;
            if (config.field === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (config.field === 'dateOfJoining') {
                comparison = new Date(a.dateOfJoining).getTime() - new Date(b.dateOfJoining).getTime();
            }
            return config.direction === 'asc' ? comparison : -comparison;
        });
    }

    filterEmployees(employees: Employee[], config: FilterConfig): Employee[] {
        return employees.filter(emp => {
            if (config.department !== 'all' && emp.department !== config.department) {
                return false;
            }
            if (config.searchQuery) {
                const query = config.searchQuery.toLowerCase();
                return emp.name.toLowerCase().includes(query) || emp.email.toLowerCase().includes(query);
            }
            return true;
        });
    }

    exportToCSV(employees: Employee[]): void {
        if (employees.length === 0) return;
        const headers = ['ID', 'Name', 'Email', 'Department', 'Date of Joining'];
        const rows = employees.map(emp => [
            emp.id,
            `"${emp.name}"`,
            emp.email,
            emp.department,
            emp.dateOfJoining
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
}
