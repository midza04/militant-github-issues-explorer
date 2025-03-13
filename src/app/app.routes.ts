import { Routes } from '@angular/router';
import { TokenEntryComponent } from './features/token-entry/token-entry.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { RepositoryListComponent } from './features/repository/repository-list/repository-list.component';
import { RepositoryDetailsComponent } from './features/repository/repository-details/repository-details.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: TokenEntryComponent },
  {
    path: 'repositories',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: RepositoryListComponent },
      {
        path: ':owner/:repositoryName',
        component: RepositoryDetailsComponent,
      },
    ],
  },
];
