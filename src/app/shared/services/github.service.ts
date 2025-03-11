import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  fetchRepositoriesDetailQuery,
  fetchRepositoriesQuery,
  loginQuery,
} from './queries/queries';
import { RepositoryDetailsParams } from '../../repository/interfaces/repository.interface';

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  private apollo = inject(Apollo);

  validateToken(token: string): Observable<any> {
    return this.apollo
      .query({
        query: loginQuery,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .pipe(map((result) => result.data));
  }

  fetchRepositories(
    token: string | undefined,
    cursor: string | null = null,
    direction: 'after' | 'before' = 'after',
  ): Observable<any> {
    const variables =
      direction === 'after'
        ? { after: cursor, before: null, first: 10, last: null }
        : { after: null, before: cursor, first: null, last: 10 };

    return this.apollo.query({
      query: fetchRepositoriesQuery,
      variables,
      context: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
  }

  fetchRepositoryDetails(params: RepositoryDetailsParams): Observable<any> {
    const { token, owner, name, cursor = null, direction = 'after' } = params;
    const variables =
      direction === 'after'
        ? { owner, name, after: cursor, before: null, first: 10, last: null }
        : { owner, name, after: null, before: cursor, first: null, last: 10 };

    return this.apollo.query({
      query: fetchRepositoriesDetailQuery,
      variables,
      context: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
  }
}
