export type Department = 'HR' | 'Engineering' | 'Sales' | 'Marketing';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated' | 'Probation';

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: Department;
    salary: number;
    address: string;
    photo?: string;
    status: EmployeeStatus;
    dateOfJoining: string;
    vacationDays: number;
    sickLeaveDays: number;
}

export interface SortConfig {
    field: 'name' | 'dateOfJoining' | 'position' | 'salary';
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    department: Department | 'all';
    status: EmployeeStatus | 'all';
    searchQuery: string;
}
