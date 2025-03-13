import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator';
import { TokenEntryComponent } from './token-entry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/basic-components/card/card.component';
import { TokenService } from './data-access/token.service';
import { Router } from '@angular/router';
import { TokenValidationResponse } from './interfaces/token-entry.interface';
import { of, throwError } from 'rxjs';

describe('TokenEntryComponent', () => {
  let spectator: Spectator<TokenEntryComponent>;
  let tokenService: TokenService;

  const createComponent = createComponentFactory({
    component: TokenEntryComponent,
    imports: [ReactiveFormsModule, CardComponent],
    providers: [mockProvider(TokenService), mockProvider(Router)],
  });

  beforeEach(() => {
    spectator = createComponent();
    tokenService = spectator.inject(TokenService);

    (tokenService.validateToken as jasmine.Spy).and.returnValue(
      of({ viewer: { __typename: 'User', login: 'testuser' } }),
    );

    (tokenService.setToken as jasmine.Spy).and.returnValue(Promise.resolve());
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show validation error when token is empty', () => {
    spectator.typeInElement('12345', 'input#token');
    spectator.blur('input#token');

    const errorMessage = spectator.query('.error-message');
    expect(errorMessage).toExist();
  });

  it('should show disabled button when token is empty', () => {
    spectator.typeInElement('', 'input#token');

    const submitButton = spectator.query('#submit');
    expect(submitButton).toBeDisabled();
  });

  it('should hide validation error when user starts typing', () => {
    spectator.typeInElement('testtoken', 'input#token');
    expect(spectator.query('.error-message')).not.toExist();
  });

  describe('submitToken', () => {
    it('should navigate to /repositories on valid token submission', () => {
      const validToken = 'valid-token-test-token';

      spectator.typeInElement(validToken, 'input#token');
      spectator.click('button[type="submit"]');

      expect(tokenService.validateToken).toHaveBeenCalledWith(validToken);
      expect(tokenService.setToken).toHaveBeenCalledWith(validToken);
    });

    it('should show error message on invalid token submission', () => {
      const invalidToken = 'invalid-token';
      const mockResponse: TokenValidationResponse = {
        viewer: {
          __typename: 'User',
          login: '',
        },
      };

      (tokenService.validateToken as jasmine.Spy).and.returnValue(
        of(mockResponse),
      );

      spectator.typeInElement(invalidToken, 'input#token');
      spectator.click('button[type="submit"]');

      expect(tokenService.validateToken).toHaveBeenCalledWith(invalidToken);
      expect(spectator.component.showErrorMessage()).toBeTrue();
    });

    it('should show error message on token validation error', () => {
      const invalidToken = 'invalid-token';

      (tokenService.validateToken as jasmine.Spy).and.returnValue(
        throwError(() => new Error('Validation failed')),
      );

      spectator.typeInElement(invalidToken, 'input#token');
      spectator.click('button[type="submit"]');

      expect(tokenService.validateToken).toHaveBeenCalledWith(invalidToken);
      expect(spectator.component.showErrorMessage()).toBeTrue();
    });
  });
});
