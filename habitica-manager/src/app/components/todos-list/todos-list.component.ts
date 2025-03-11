import { Component, OnInit, Signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss',
  standalone: false,
})
export class TodosListComponent implements OnInit {
  todos: Signal<Todo[] | undefined>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.todos = this.dataService.todosToDisplay;
  }
}
