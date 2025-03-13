import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from './data-access/token.service';
import { CardComponent } from '../../shared/basic-components/card/card.component';
import {
  TokenEntry,
  TokenValidationResponse,
} from './interfaces/token-entry.interface';

@Component({
  selector: 'app-token-entry',
  imports: [ReactiveFormsModule, CardComponent],
  templateUrl: './token-entry.component.html',
  styleUrl: './token-entry.component.scss',
})
export class TokenEntryComponent implements OnInit {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  tokenForm = new FormGroup<TokenEntry>({
    token: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  showErrorMessage = signal<boolean>(false);
  showValidationError = signal<boolean>(false);

  isTokenTooShort = computed(
    () => !!this.tokenForm.controls.token.errors?.['minlength'],
  );

  ngOnInit(): void {
    this.tokenForm.controls.token.valueChanges.subscribe(() => {
      this.handleTokenValidationState();
    });
  }

  submitToken() {
    const token = this.tokenForm.value.token;
    if (!token) return;
    this.tokenService.validateToken(token).subscribe({
      next: (response: TokenValidationResponse) => {
        if (response.viewer.login) {
          this.tokenService.setToken(token).then(() => {
            this.router.navigate(['/repositories']);
          });
        } else {
          this.displayErrorMessage(true);
        }
      },
      error: () => {
        this.displayErrorMessage(true);
      },
    });
  }

  private handleTokenValidationState(): void {
    if (this.showErrorMessage()) {
      this.showErrorMessage.set(false);
    }

    const control = this.tokenForm.controls.token;
    this.showValidationError.set(
      control.invalid && (control.touched || control.dirty),
    );
  }

  private displayErrorMessage(state: boolean) {
    this.tokenService.clearToken();
    this.showErrorMessage.set(state);
  }
}
