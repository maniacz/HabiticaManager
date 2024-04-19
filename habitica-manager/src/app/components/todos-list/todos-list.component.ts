import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { Tag } from '../../models/tag';
import { DataService } from '../../services/data.service';
import { filter, first, firstValueFrom, map } from 'rxjs';
import { TodoElement } from '../../models/todo-element';
import { TagValue } from '../../enums/tag-values';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css'
})
export class TodosListComponent implements OnInit {
  @Input() todosList: TodoElement[] = [];
  TagValue = TagValue;

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

  async onAssignTodosForWeek(weekTagValue: TagValue) {
    const weekTag = await this.getTag(weekTagValue);
    let alertMessage = '';
    let selectedTodos = this.todosList.filter(todo => todo.isSelected);
    selectedTodos.forEach(todo => {
      if (todo.tags.map(t => t.name).includes(weekTagValue)) {
        alertMessage += 'Todo ' + todo.taskName + ' już jest oznaczone tagiem: ' + weekTagValue + '\n';
        return;
      }
      if (weekTag) {
        this.dataService.assignCurrentWeekTagForTodo(todo, weekTag)
        .subscribe(response => {
          console.log(response);
        })
      } else {
        alert('Użytkownik nie posiada zdefiniowanego taga ' + weekTagValue + ' w Habitice');
      }
    });
    if (alertMessage) {
      alert(alertMessage);
    }
  }

  async getTag(tagName: string): Promise<Tag | undefined> {
    const allTags = await firstValueFrom(this.dataService.fetchTags());
    return allTags.find(t => t.name === tagName);
  }

  onShowNextWeekTodos() {
    const result = this.todosList.filter(t => t.tags.find(tag => tag.name == TagValue.NextWeek));
    this.todosList = result;
  }
}
