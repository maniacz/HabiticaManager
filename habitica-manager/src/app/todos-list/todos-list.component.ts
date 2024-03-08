import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css'
})
export class TodosListComponent implements OnInit {
  todosList: Todo[] = [];

  dummyTodos: Todo[] = [
    { taskName: 'Go to the shop', tagIds: [] },
    { taskName: 'Clean the house', tagIds: []},
    { taskName: 'Buy milk', tagIds: []}
  ];

  ngOnInit(): void {
    this.todosList = this.dummyTodos;
  }

  onLoadTodos() {
    this.todosList = this.dummyTodos;
  }
}
