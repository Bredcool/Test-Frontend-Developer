import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from './employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private employees = new BehaviorSubject<Employee[]>([]);
    employees$ = this.employees.asObservable();

    constructor() {
        const saved = localStorage.getItem('employees');
        if (saved) {
            const parsed: Employee[] = JSON.parse(saved).map((e: any) => ({
                ...e,
                birthDate: new Date(e.birthDate), // ✅ konversi kembali ke Date
            }));
            this.employees.next(parsed);
        } else {
            const dummy: Employee[] = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                username: `user${i + 1}`,
                firstName: `First${i + 1}`,
                lastName: `Last${i + 1}`,
                email: `user${i + 1}@mail.com`,
                birthDate: new Date(1990, 0, (i % 28) + 1),
                basicSalary: Math.floor(Math.random() * 10000000),
                status: i % 2 === 0 ? 'Active' : 'Inactive',
                group: `Group ${i % 10}`,
                description: `This is description for user${i + 1}` // ✅ pakai string, bukan Date
            }));
            this.employees.next(dummy);
            localStorage.setItem('employees', JSON.stringify(dummy));
        }
    }

    private saveToStorage(data: Employee[]) {
        localStorage.setItem('employees', JSON.stringify(data));
    }

    getEmployees() {
        return this.employees.value;
    }

    getEmployeeById(id: number): Employee | undefined {
        return this.employees.value.find(e => e.id === id);
    }

    addEmployee(emp: Employee) {
        const current = this.employees.value;
        const newEmp = { ...emp, id: current.length + 1 };
        const updated = [...current, newEmp];
        this.employees.next(updated);
        this.saveToStorage(updated);
    }

    updateEmployee(updated: Employee) {
        const current = this.employees.value;
        const index = current.findIndex(e => e.id === updated.id);
        if (index !== -1) {
            current[index] = { ...updated };
            this.employees.next([...current]);
            this.saveToStorage([...current]);
        }
    }

    deleteEmployee(id: number) {
        const current = this.employees.value.filter(e => e.id !== id);
        this.employees.next(current);
        this.saveToStorage(current);
    }
}
