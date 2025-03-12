import { gql } from 'apollo-angular';

// Test query to validate the token
export const loginQuery = gql`
  {
    viewer {
      login
    }
  }
`;

// Query to fetch public repositories sorted by star count
export const fetchRepositoriesQuery = gql`
  query ($after: String, $before: String, $first: Int, $last: Int) {
    search(
      query: "stars:>10000"
      type: REPOSITORY
      first: $first
      last: $last
      after: $after
      before: $before
    ) {
      edges {
        node {
          ... on Repository {
            name
            owner {
              login
            }
            stargazerCount
            createdAt
            description
            nameWithOwner
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Query to fetch repository details and its issues sorted by creation date descending
export const fetchRepositoriesDetailQuery = gql`
  query (
    $owner: String!
    $name: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    repository(owner: $owner, name: $name) {
      name
      owner {
        login
      }
      issues(
        first: $first
        last: $last
        after: $after
        before: $before
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            title
            createdAt
            url
          }
        }
      }
    }
  }
`;
