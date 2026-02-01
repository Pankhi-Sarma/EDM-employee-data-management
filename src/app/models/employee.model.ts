export type Department = 'HR' | 'Engineering' | 'Sales' | 'Marketing';

export interface Employee {
    id: string;
    name: string;
    email: string;
    department: Department;
    dateOfJoining: string;
}

export interface SortConfig {
    field: 'name' | 'dateOfJoining';
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    department: Department | 'all';
    searchQuery: string;
}
