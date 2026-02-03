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

        let nextId = 121;
        if (employees.length > 0) {
            const maxId = Math.max(...employees.map(e => parseInt(e.id) || 0));
            nextId = maxId + 1;
        }

        const newEmployee: Employee = {
            ...employee,
            id: nextId.toString()
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
            } else if (config.field === 'position') {
                comparison = a.position.localeCompare(b.position);
            } else if (config.field === 'salary') {
                comparison = a.salary - b.salary;
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
            if (config.status !== 'all' && emp.status !== config.status) {
                return false;
            }
            if (config.searchQuery) {
                const query = config.searchQuery.toLowerCase();
                return emp.name.toLowerCase().includes(query) ||
                    emp.email.toLowerCase().includes(query) ||
                    emp.position.toLowerCase().includes(query) ||
                    emp.phone.includes(query);
            }
            return true;
        });
    }

    exportToCSV(employees: Employee[]): void {
        if (employees.length === 0) return;

        const headers = ['ID', 'Name', 'Email', 'Phone', 'Position', 'Department', 'Salary', 'Address', 'Status', 'Date of Joining', 'Vacation Days', 'Sick Leave Days'];
        const rows = employees.map(emp => [
            `"${emp.id}"`,
            `"${emp.name}"`,
            `"${emp.email}"`,
            `"${emp.phone}"`,
            `"${emp.position}"`,
            `"${emp.department}"`,
            `"${emp.salary}"`,
            `"${emp.address}"`,
            `"${emp.status}"`,
            `"${emp.dateOfJoining}"`,
            `"${emp.vacationDays}"`,
            `"${emp.sickLeaveDays}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
}
