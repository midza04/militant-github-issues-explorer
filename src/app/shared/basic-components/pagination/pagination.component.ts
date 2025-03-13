import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
  @Input() pageInfo!: PageInfo;
  @Output() nextPage = new EventEmitter<any>();
  @Output() previousPage = new EventEmitter<any>();

  onNextPage() {
    if (this.pageInfo.hasNextPage && this.pageInfo.endCursor) {
      this.nextPage.emit(this.pageInfo.endCursor);
    }
  }

  onPreviousPage() {
    if (this.pageInfo.hasPreviousPage && this.pageInfo.startCursor) {
      this.previousPage.emit(this.pageInfo.startCursor);
    }
  }
}
