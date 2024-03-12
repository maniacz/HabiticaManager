import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { Tag } from '../../models/tag';
import { DataService } from '../../services/data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css'
})
export class TodosListComponent implements OnInit {
  @Input() todosList: Todo[] = [];

  dummyTags1: Tag[] = [
    { id: "958a73fb-d341-4513-83c2-c90c318193b5", name: "dom" },
    { id: "2995fb09-6228-4388-9082-7fc657fd7a85", name: "pilne ważne" },
    // { id: "981f7a2c-fe2d-4484-b994-996868f6f251", name: "przy kompie" }
  ];

  dummyTodos: Todo[] = [
    // { taskName: 'Go to the shop', tags: this.dummyTags1 },
    // { taskName: 'Clean the house', tags: []},
    // { taskName: 'Buy milk', tags: []},
    { taskName: ':bangbang::house: Zawieź narty do serwisu', tags: this.dummyTags1},
    { taskName: ':bangbang::car: Zawieź narty do serwisu', tags: this.dummyTags1},
    { taskName: ':house: Zawieź narty do serwisu', tags: this.dummyTags1},
    { taskName: ':bangbang::house::car: Zawieź narty do serwisu', tags: this.dummyTags1},
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.todosList = this.dummyTodos;
  }

  onLoadTodos() {
    this.dataService.fetchTodos()
      .pipe(map(responseData => {

        return responseData;
      }))
      .subscribe(
        response => {
          console.log(response);
          this.todosList = response;
        }
      );
  }
}
