import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GitHubService } from '../../shared/services/github.service';
import { TokenService } from '../../token-entry/data-access/token.service';
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

  repositories: RepositoryEdge[] = [];
  pageInfo!: PageInfo;
  loading = signal(false);
  error = signal<string>('');

  ngOnInit(): void {
    this.loadRepositories();
  }

  loadRepositories(cursor?: string, isPrevious = false) {
    this.loading.set(true);
    const direction = isPrevious ? 'before' : 'after';
    const repositoryParams: RepositoryParams = {
      cursor,
      direction,
    };
    this.githubService.fetchRepositories(repositoryParams).subscribe({
      next: (data: RepositoryResponse) => {
        if (data && data.data && data.data.search) {
          this.repositories = data.data.search.edges;
          this.pageInfo = data.data.search.pageInfo;
        } else {
          this.error.set('Unexpected API response format.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to fetch repositories.');
        this.loading.set(false);
      },
    });
  }

  fetchNextPage(cursor: string) {
    this.loadRepositories(cursor);
  }

  fetchPreviousPage(cursor: string) {
    this.loadRepositories(cursor, true);
  }
}
