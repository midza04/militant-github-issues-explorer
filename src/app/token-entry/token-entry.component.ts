import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from './data-access/token.service';
import { CardComponent } from '../shared/basic-components/card/card.component';
import { TokenValidationResponse } from './interfaces/token-entry.interface';

@Component({
  selector: 'app-token-entry',
  imports: [ReactiveFormsModule, CardComponent],
  templateUrl: './token-entry.component.html',
  styleUrl: './token-entry.component.scss',
})
export class TokenEntryComponent {
  private form = inject(FormBuilder);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  tokenForm: FormGroup;
  errorMessage?: string;

  constructor() {
    this.tokenForm = this.form.group({
      token: ['', Validators.required],
    });
  }

  submitToken() {
    const token = this.tokenForm.value.token;
    this.tokenService.validateToken(token).subscribe({
      next: (response: TokenValidationResponse) => {
        if (response.viewer.login) {
          this.tokenService.setToken(token);
          this.router.navigate(['/repositories']);
        } else {
          this.tokenService.clearToken();
          this.errorMessage = 'Invalid API token. Please try again.';
        }
      },
      error: (error) => {
        this.tokenService.clearToken();
        this.errorMessage = 'Invalid API token. Please try again.' + error;
      },
    });
  }
}
