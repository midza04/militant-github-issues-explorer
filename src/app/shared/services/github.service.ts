import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  fetchRepositoriesDetailQuery,
  fetchRepositoriesQuery,
  loginQuery,
} from './queries/repositories.queries';
import { RepositoryParams } from '../../features/repository/interfaces/repository.interface';

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
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result) => result.data));
  }

  fetchRepositories(params: RepositoryParams): Observable<any> {
    const { cursor = null, direction = 'after' } = params;
    const variables =
      direction === 'after'
        ? { after: cursor, before: null, first: 10, last: null }
        : { after: null, before: cursor, first: null, last: 10 };

    return this.apollo.query({
      query: fetchRepositoriesQuery,
      variables,
    });
  }

  fetchRepositoryDetails(params: RepositoryParams): Observable<any> {
    const { owner, name, cursor = null, direction = 'after' } = params;
    const variables =
      direction === 'after'
        ? { owner, name, after: cursor, before: null, first: 10, last: null }
        : { owner, name, after: null, before: cursor, first: null, last: 10 };

    return this.apollo.query({
      query: fetchRepositoriesDetailQuery,
      variables,
    });
  }
}
