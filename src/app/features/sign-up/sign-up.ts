import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.ts';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';

  signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.signUpForm.getRawValue();

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const success = this.authService.register({
      name: name!,
      email: email!,
      password: password!,
    });

    if (!success) {
      this.errorMessage = 'An account with this email already exists.';
      return;
    }

    this.router.navigate(['/sign-in']);
  }
}
