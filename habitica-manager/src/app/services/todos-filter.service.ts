import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, filter, map, tap } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodosFilterService {
  todos: Todo[] = [];

  constructor(private dataService: DataService) { }

  // Filters todos returnig todos containing tags only with provided tagNames or with provided tagNames and other tags
  filterTodos(tagNames: string[], onlySelectedTags: boolean): Observable<Todo[]> {
    return this.dataService.fetchTodos()
      .pipe(map(todos => todos.filter(todo => todo.tags.length > 0)))
      .pipe(map(todos => todos.filter(todo => {
        if (onlySelectedTags) {
          return todo.tags.map(t => t.name).every(t => tagNames.includes(t) && tagNames.length === todo.tags.length)
        } else {
          return tagNames.every(tagName => todo.tags.map(t => t.name).includes(tagName))          
        }
      })))
      .pipe(tap((response) => console.log(response))
      );
  }
}
