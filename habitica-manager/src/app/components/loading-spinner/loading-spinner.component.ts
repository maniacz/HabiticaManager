import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-overlay" *ngIf="loading$ | async">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.css'],
  standalone: false,
})
export class LoadingSpinnerComponent {
  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
