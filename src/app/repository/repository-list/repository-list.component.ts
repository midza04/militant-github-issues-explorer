import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GitHubService } from '../../shared/services/github.service';
import {
  PageInfo,
  RepositoryEdge,
  RepositoryParams,
  RepositoryResponse,
} from '../interfaces/repository.interface';
import { PaginationComponent } from '../../shared/basic-components/pagination/pagination.component';
import { CardComponent } from '../../shared/basic-components/card/card.component';
import { NumbersPipe } from '../../utils/pipes/numbers.pipe';
import { DatePipe } from '@angular/common';
import { catchError, of } from 'rxjs';
import { LoadingState } from '../interfaces/state.interface';

@Component({
  selector: 'lx-repository-list',
  imports: [
    RouterLink,
    PaginationComponent,
    CardComponent,
    NumbersPipe,
    DatePipe,
  ],
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss',
})
export class RepositoryListComponent implements OnInit {
  private readonly githubService = inject(GitHubService);
  state = signal<LoadingState>({
    loading: false,
    error: '',
    data: null,
  });

  pageInfo = computed<PageInfo>(() => {
    return this.state().data?.data?.search?.pageInfo;
  });

  repositories = computed<RepositoryEdge[]>(() => {
    return this.state().data.data.search.edges;
  });

  loading = computed<boolean>(() => {
    return this.state().loading;
  });

  error = computed(() => {
    return this.state().error;
  });

  showRepositories = computed(() => {
    return !this.loading() && !this.error();
  });

  ngOnInit(): void {
    this.loadRepositories();
  }

  loadRepositories(cursor?: string, isPrevious = false) {
    this.state.update((s) => ({ ...s, loading: true }));
    const direction = isPrevious ? 'before' : 'after';
    const repositoryParams: RepositoryParams = {
      cursor,
      direction,
    };

    this.githubService
      .fetchRepositories(repositoryParams)
      .pipe(
        catchError(() => {
          this.state.update((state) => ({
            ...state,
            error: 'Failed to load repositories',
            loading: false,
          }));
          return of(null);
        }),
      )
      .subscribe((data: RepositoryResponse) => {
        this.state.update((state) => ({
          ...state,
          data,
          loading: false,
        }));
      });
  }

  fetchNextPage(cursor: string) {
    this.loadRepositories(cursor);
  }

  fetchPreviousPage(cursor: string) {
    this.loadRepositories(cursor, true);
  }
}
