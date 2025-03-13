import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../features/token-entry/data-access/token.service';

@Component({
  selector: 'lx-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private tokenService = inject(TokenService);

  navigateToTokenEntry() {
    this.router.navigateByUrl('/').then(() => {
      this.tokenService.clearToken();
    });
  }
}
