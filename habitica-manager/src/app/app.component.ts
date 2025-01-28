import { Component } from '@angular/core';
import { FilterTodoEventArgs } from './models/filter-todos-event-args';
import { Todo } from './models/todo';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent {
  title = 'habitica-manager';

  constructor(private dataService: DataService) {}

  onFilterTodos(event: FilterTodoEventArgs) {
    this.dataService.filterTodosByTags(event.selectedTagNames, event.selectedFilterContainingAllTags);
  }
}
