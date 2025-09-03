import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isSubmitting = false; // ⬅️ indikator loading

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  getError(controlName: string): string | null {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control.invalid) {
      if (control.errors?.['required']) return `${controlName} is required`;
      if (control.errors?.['minlength'])
        return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { username, password } = this.loginForm.value;

    const success = this.authService.login(username, password);

    setTimeout(() => { // simulasi async / API call
      this.isSubmitting = false;
      if (success) {
        this.router.navigate(['/test/employees']);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    }, 600);
  }
}
