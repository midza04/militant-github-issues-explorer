import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitHubService } from '../../shared/services/github.service';
import { TokenService } from '../../token-entry/data-access/token.service';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '../../shared/basic-components/pagination/pagination.component';
import {
  IssueEdge,
  PageInfo,
  Repository,
  RepositoryParams,
  RepositoryDetailsResponse,
} from '../interfaces/repository.interface';
import { CardComponent } from '../../shared/basic-components/card/card.component';

@Component({
  selector: 'lx-repository-details',
  imports: [DatePipe, PaginationComponent, CardComponent],
  templateUrl: './repository-details.component.html',
  styleUrl: './repository-details.component.scss',
})
export class RepositoryDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private githubService = inject(GitHubService);

  owner?: string | null;
  repositoryName?: string | null;
  repository!: Repository;
  issues: IssueEdge[] = [];
  pageInfo!: PageInfo;
  loading = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.owner = params.get('owner');
      this.repositoryName = params.get('repositoryName');
      this.loadRepositoryDetails();
    });
  }

  loadRepositoryDetails(
    cursor: string | null = null,
    direction: 'after' | 'before' = 'after',
  ) {
    this.loading.set(true);
    const repositoryDetailsParams: RepositoryParams = {
      owner: this.owner,
      name: this.repositoryName,
      cursor,
      direction,
    };

    this.githubService
      .fetchRepositoryDetails(repositoryDetailsParams)
      .subscribe({
        next: (data: RepositoryDetailsResponse) => {
          if (data && data.data && data.data.repository) {
            this.repository = data.data.repository;
            this.issues = this.repository.issues.edges;
            this.pageInfo = this.repository.issues.pageInfo;
          } else {
            this.error.set('Failed to load repository details');
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to fetch repository details');
          this.loading.set(false);
        },
      });
  }

  fetchNextPage(cursor: string) {
    this.loadRepositoryDetails(cursor);
  }

  fetchPreviousPage(cursor: string) {
    this.loadRepositoryDetails(cursor, 'before');
  }
}
