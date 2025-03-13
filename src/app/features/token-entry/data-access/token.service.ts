import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GitHubService } from '../../../shared/services/github.service';
import { TokenValidationResponse } from '../interfaces/token-entry.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private githubService = inject(GitHubService);
  private token = signal<string | undefined>('');

  async setToken(token: string) {
    this.token.set(token);
  }

  getToken(): string | undefined {
    return this.token();
  }

  clearToken() {
    this.token.set(undefined);
  }

  validateToken(token: string): Observable<TokenValidationResponse> {
    return this.githubService.validateToken(token);
  }
}
