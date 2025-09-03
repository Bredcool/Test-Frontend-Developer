import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'] // ✅ harus plural array
})

export class AddComponent implements OnInit {
  form: FormGroup;
  groups = Array.from({ length: 10 }, (_, i) => `Group ${i + 1}`);
  today: string = new Date().toISOString().split('T')[0];
  isEdit = false;
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeId = Number(id);
      const emp = this.employeeService.getEmployeeById(this.employeeId);
      if (emp) {
        this.form.patchValue({
          ...emp,
          birthDate: emp.birthDate.toISOString().split('T')[0] // ✅ date -> yyyy-MM-dd
        });
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const emp: Employee = {
        ...formValue,
        id: this.isEdit ? this.employeeId : 0,
        birthDate: new Date(formValue.birthDate), // ✅ string -> Date
        description: formValue.description        // ✅ biarkan string
      };

      if (this.isEdit) {
        this.employeeService.updateEmployee(emp);
        alert('Employee updated successfully!');
      } else {
        this.employeeService.addEmployee(emp);
        alert('Employee added successfully!');
      }
      this.router.navigate(['/test/employees']);
    }
  }

  onCancel() {
    this.router.navigate(['/test/employees']);
  }

  // helper untuk tampilkan error
  getError(field: string): string | null {
    const control = this.form.get(field);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) return 'This field is required';
      if (control.errors?.['email']) return 'Invalid email format';
      if (control.errors?.['pattern']) return 'Only numbers allowed';
    }
    return null;
  }
}
