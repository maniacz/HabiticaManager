import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { Tag } from '../../models/tag';
import { DataService } from '../../services/data.service';
import { filter, first, firstValueFrom, map } from 'rxjs';
import { TodoElement } from '../../models/todo-element';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css'
})
export class TodosListComponent implements OnInit {
  @Input() todosList: TodoElement[] = [];

  dummyTags1: Tag[] = [
    { id: "958a73fb-d341-4513-83c2-c90c318193b5", name: "dom" },
    { id: "2995fb09-6228-4388-9082-7fc657fd7a85", name: "pilne ważne" },
    // { id: "981f7a2c-fe2d-4484-b994-996868f6f251", name: "przy kompie" }
  ];

  dummyTodos: Todo[] = [
    // { taskName: 'Go to the shop', tags: this.dummyTags1 },
    // { taskName: 'Clean the house', tags: []},
    // { taskName: 'Buy milk', tags: []},
    { taskId: 'fdsff', taskName: ':bangbang::house: Zawieź narty do serwisu', tags: this.dummyTags1, isSelected: false },
    { taskId: 'fdsff', taskName: ':bangbang::car: Zawieź narty do serwisu', tags: this.dummyTags1, isSelected: false },
    { taskId: 'fdsff', taskName: ':house: Zawieź narty do serwisu', tags: this.dummyTags1, isSelected: false },
    { taskId: 'fdsff', taskName: ':bangbang::house::car: Zawieź narty do serwisu', tags: this.dummyTags1, isSelected: false },
  ];

  mockTodos: TodoElement[] = [
    new TodoElement('fdsff',':bangbang::house: Zawieź narty do serwisu', this.dummyTags1)
  ]

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.todosList = this.dummyTodos;
  }

  onLoadTodos() {
    this.dataService.fetchTodos()
      // .pipe(map(responseData => {
      //   return responseData;
      // }))
      .subscribe(
        response => {
          console.log(response);
          // this.todosList = response;
          this.todosList = response;
        }
      );
    // this.todosList.forEach(todo => todo.isSelected = false);
  }

  async onSetCurrentWeekTodos() {
    const currentWeekTag = await this.getCurrentWeekTag();


    let alertMessage = '';
    let selectedTodos = this.todosList.filter(todo => todo.isSelected);
    selectedTodos.forEach(todo => {
      if (todo.tags.map(t => t.name).includes('w tym tygodniu')) {
        alertMessage += 'Todo ' + todo.taskName + ' już jest oznaczone tagiem: "w tym tygodniu"\n';
        return;
      }
      if (currentWeekTag) {
        this.dataService.assignCurrentWeekTagForTodo(todo, currentWeekTag)
        .subscribe(response => {
          console.log(response);
        })
      } else {
        // TODO show alert and handle situation when currentWeekTag wasn't found in Habitica users' tags
      }
    });
    if (alertMessage) {
      alert(alertMessage);
    }
  }

  async getCurrentWeekTag(): Promise<Tag | undefined> {
    const tags = await firstValueFrom(this.dataService.fetchTags());
    const currentWeekTag = tags.find(t => t.name === 'w tym tygodniu');

    return currentWeekTag;
  }
}
