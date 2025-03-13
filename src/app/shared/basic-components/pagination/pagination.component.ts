import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PageInfo } from '../../../features/repository/interfaces/repository.interface';

@Component({
  selector: 'lx-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  pageInfo = input.required<PageInfo>();
  nextPage = output<string>();
  previousPage = output<string>();

  onNextPage() {
    const pageInfo = this.pageInfo();
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      this.nextPage.emit(pageInfo.endCursor);
    }
  }

  onPreviousPage() {
    const pageInfo = this.pageInfo();
    if (pageInfo.hasPreviousPage && pageInfo.startCursor) {
      this.previousPage.emit(pageInfo.startCursor);
    }
  }
}
