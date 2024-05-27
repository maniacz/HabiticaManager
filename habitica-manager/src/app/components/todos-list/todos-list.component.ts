import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { Tag } from '../../models/tag';
import { DataService } from '../../services/data.service';
import { Subscription, filter, first, firstValueFrom, map } from 'rxjs';
import { TodoElement } from '../../models/todo-element';
import { TagValue } from '../../enums/tag-values';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css'
})
export class TodosListComponent implements OnInit, OnDestroy {
  @Input() todosList: TodoElement[] = [];
  TagValue = TagValue;
  error: String = "";
  private errorSub!: Subscription;

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

  constructor(private dataService: DataService, private tagService: TagService) {}

  ngOnInit(): void {
    this.todosList = this.dummyTodos;
    this.errorSub = this.tagService.errorSub.subscribe(errorMessage => {
      this.error = errorMessage;
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
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
    const weekTag = await this.tagService.getTag(weekTagValue);
    let alertMessage = '';
    let selectedTodos = this.todosList.filter(todo => todo.isSelected);
    selectedTodos.forEach(todo => {
      if (todo.tags.map(t => t.name).includes(weekTagValue)) {
        alertMessage += 'Todo ' + todo.taskName + ' już jest oznaczone tagiem: ' + weekTagValue + '\n';
        return;
      }
      if (weekTag) {
        this.dataService.assignTagForTodo(todo, weekTag)
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

  onShowCurrentWeekTodos() {
    this.todosList = this.getCurrentWeekTodos();
  }

  onShowNextWeekTodos() {
    this.todosList = this.getNextWeekTodos();
  }

  onConvertNextWeekTodosToCurrentWeek() {
    const nextWeekTodos = this.getNextWeekTodos();
    nextWeekTodos.forEach(todo => {
      this.tagService.removeNextWeekTagFromTodo(todo);
      this.tagService.assignCurrentWeekTagForTodo(todo);
    });
  }

  onHandleError() {
    this.error = "";
  }

  private getNextWeekTodos(): TodoElement[] {
    return this.todosList.filter(t => t.tags.find(tag => tag.name == TagValue.NextWeek));
  }

  private getCurrentWeekTodos(): TodoElement[] {
    return this.todosList.filter(t => t.tags.find(tag => tag.name == TagValue.CurrentWeek));
  }
}
