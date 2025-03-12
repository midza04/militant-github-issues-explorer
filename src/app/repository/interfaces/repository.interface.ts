export interface RepositoryResponse {
  data: {
    search: {
      repositoryCount: number;
      pageInfo: PageInfo;
      edges: RepositoryEdge[];
    };
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface RepositoryEdge {
  node: RepositoryNode;
}

export interface RepositoryNode {
  name: string;
  owner: {
    login: string;
  };
  stargazerCount: number;
  createdAt: Date;
  description: string;
  nameWithOwner: string;
}

export interface RepositoryDetailsResponse {
  data: Data;
}

export interface Data {
  repository: Repository;
}

export interface Repository {
  name: string;
  owner: Owner;
  issues: IssueConnection;
}

export interface Owner {
  login: string;
}

export interface IssueConnection {
  pageInfo: PageInfo;
  edges: IssueEdge[];
}

export interface IssueEdge {
  node: Issue;
}

export interface Issue {
  title: string;
  createdAt: string;
  url: string;
}

export interface RepositoryParams {
  owner?: string | null;
  name?: string | null;
  cursor?: string | null;
  direction?: 'after' | 'before';
}
