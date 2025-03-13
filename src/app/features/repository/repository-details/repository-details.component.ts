import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitHubService } from '../../../shared/services/github.service';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '../../../shared/basic-components/pagination/pagination.component';
import {
  IssueEdge,
  PageInfo,
  Repository,
  RepositoryDetailsResponse,
  RepositoryParams,
} from '../interfaces/repository.interface';
import { CardComponent } from '../../../shared/basic-components/card/card.component';
import { LoadingState } from '../interfaces/state.interface';
import { Location } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'lx-repository-details',
  imports: [DatePipe, PaginationComponent, CardComponent],
  templateUrl: './repository-details.component.html',
  styleUrl: './repository-details.component.scss',
})
export class RepositoryDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private githubService = inject(GitHubService);
  private location = inject(Location);

  state = signal<LoadingState>({
    loading: false,
    error: '',
    data: null,
  });

  owner = signal<string | null>('');
  repositoryName = signal<string | null>('');

  showRepositoryDetails: Signal<boolean> = computed(() => {
    return !!(!this.loading() && !this.error() && this.repository());
  });

  pageInfo = computed<PageInfo>(() => {
    return this.repository().issues.pageInfo;
  });

  repository = computed<Repository>(() => {
    return this.state().data.repository;
  });

  issues = computed<IssueEdge[]>(() => {
    return this.repository().issues.edges;
  });

  loading = computed<boolean>(() => {
    return this.state().loading;
  });

  error = computed(() => {
    return this.state().error;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.owner.set(params.get('owner'));
      this.repositoryName.set(params.get('repositoryName'));
      this.loadRepositoryDetails();
    });
  }

  loadRepositoryDetails(
    cursor: string | null = null,
    direction: 'after' | 'before' = 'after',
  ) {
    this.state.update((state) => ({ ...state, loading: true }));
    const repositoryDetailsParams: RepositoryParams = {
      owner: this.owner(),
      name: this.repositoryName(),
      cursor,
      direction,
    };

    this.githubService
      .fetchRepositoryDetails(repositoryDetailsParams)
      .pipe(
        catchError(() => {
          this.state.update((state) => ({
            ...state,
            error: 'Failed to load repository details',
            loading: false,
          }));
          return of(null);
        }),
      )
      .subscribe((response: RepositoryDetailsResponse | null) => {
        this.state.update((state) => ({
          ...state,
          data: response,
          loading: false,
        }));
      });
  }

  fetchNextPage(cursor: string) {
    this.loadRepositoryDetails(cursor);
  }

  fetchPreviousPage(cursor: string) {
    this.loadRepositoryDetails(cursor, 'before');
  }

  goBack() {
    this.location.back();
  }
}
