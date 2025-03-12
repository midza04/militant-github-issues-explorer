import { Component, inject, OnInit } from '@angular/core';
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
  private tokenService = inject(TokenService);

  owner?: string | null;
  repositoryName?: string | null;
  repository!: Repository;
  issues: IssueEdge[] = [];
  pageInfo!: PageInfo;
  loading = false;
  error?: string;

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
    this.loading = true;
    const token = this.tokenService.getToken();

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
            // Todo try and implement a store for this
            this.repository = data.data.repository;
            this.issues = this.repository.issues.edges;
            this.pageInfo = this.repository.issues.pageInfo;
          } else {
            this.error = 'Unexpected API response format.';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch repository details.';
          this.loading = false;
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
