import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  filtered: Employee[] = [];
  searchName = '';
  searchEmail = '';
  pageSize = 10;
  currentPage = 1;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees = this.employeeService.getEmployees();
    this.applyFilter();
  }

  // 🔎 Filter logic di satu tempat
  applyFilter() {
    const name = this.searchName.toLowerCase();
    const email = this.searchEmail.toLowerCase();

    this.filtered = this.employees.filter(e =>
      (
        e.username.toLowerCase().includes(name) ||
        e.firstName.toLowerCase().includes(name) ||
        e.lastName.toLowerCase().includes(name)
      ) &&
      e.email.toLowerCase().includes(email)
    );

    // reset ke page 1 biar gak kosong setelah search
    this.currentPage = 1;
  }

  // ✅ Paged data
  get pagedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  editEmployee(emp: Employee) {
    this.router.navigate(['/test/employees/edit', emp.id]);
  }

  deleteEmployee(emp: Employee) {
    if (confirm(`Are you sure to delete ${emp.firstName}?`)) {
      this.employeeService.deleteEmployee(emp.id);
      this.loadEmployees();
      alert(`${emp.firstName} deleted successfully!`);

      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    }
  }

  goToAdd() {
    this.router.navigate(['/test/employees/add']);
  }

  goToDetail(id: number) {
    this.router.navigate(['/test/employees', id]);
  }

  // ✅ Total pages hanya berdasarkan hasil filter
  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize) || 1;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
