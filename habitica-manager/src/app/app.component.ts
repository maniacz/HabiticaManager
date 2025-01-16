import { Component } from '@angular/core';
import { FilterTodoEventArgs } from './models/filter-todos-event-args';
import { TodosFilterService } from './services/todos-filter.service';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent {
  title = 'habitica-manager';
  todosToDisplay: Todo[] = [];

  constructor(private todosFilterService: TodosFilterService) {}

  onFilterTodos(event: FilterTodoEventArgs) {
    this.todosFilterService.filterTodos(event.selectedTagNames, event.selectedFilterContainingAllTags)
      .subscribe(response => this.todosToDisplay = response);
  }
}
