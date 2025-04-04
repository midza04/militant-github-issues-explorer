import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  fetchRepositoriesDetailQuery,
  fetchRepositoriesQuery,
  loginQuery,
} from './queries/repositories.queries';
import {
  RepositoryDetailsResponse,
  RepositoryParams,
  RepositoryResponse,
} from '../../features/repository/interfaces/repository.interface';
import { TokenValidationResponse } from '../../features/token-entry/interfaces/token-entry.interface';

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  private apollo = inject(Apollo);

  validateToken(token: string): Observable<TokenValidationResponse> {
    return this.apollo
      .query<TokenValidationResponse>({
        query: loginQuery,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result) => result.data));
  }

  fetchRepositories(params: RepositoryParams): Observable<RepositoryResponse> {
    const { cursor = null, direction = 'after' } = params;
    const variables =
      direction === 'after'
        ? { after: cursor, before: null, first: 10, last: null }
        : { after: null, before: cursor, first: null, last: 10 };

    return this.apollo
      .query<RepositoryResponse>({
        query: fetchRepositoriesQuery,
        variables,
      })
      .pipe(map((result) => result.data));
  }

  fetchRepositoryDetails(
    params: RepositoryParams,
  ): Observable<RepositoryDetailsResponse> {
    const { owner, name, cursor = null, direction = 'after' } = params;
    const variables =
      direction === 'after'
        ? { owner, name, after: cursor, before: null, first: 10, last: null }
        : { owner, name, after: null, before: cursor, first: null, last: 10 };

    return this.apollo
      .query<RepositoryDetailsResponse>({
        query: fetchRepositoriesDetailQuery,
        variables,
      })
      .pipe(map((result) => result.data));
  }
}
