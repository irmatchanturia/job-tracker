import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.ts';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  errorMessage = '';

  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInForm.getRawValue();

    const success = this.authService.login(email!, password!);

    if (!success) {
      this.errorMessage = 'Incorrect email or password.';
      return;
    }

    this.router.navigate(['/applications']);
  }
}
