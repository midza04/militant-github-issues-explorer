import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GitHubService } from '../../shared/services/github.service';
import { TokenValidationResponse } from '../interfaces/token-entry.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token?: string | undefined;

  constructor(private githubService: GitHubService) {}

  async setToken(token: string) {
    this.token = token;
  }

  getToken(): string | undefined {
    return this.token;
  }

  clearToken() {
    this.token = undefined;
  }

  validateToken(token: string): Observable<TokenValidationResponse> {
    return this.githubService.validateToken(token);
  }
}
