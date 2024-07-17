import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { Tag } from '../../models/tag';
import { DataService } from '../../services/data.service';
import { Subscription, filter, first, firstValueFrom, map } from 'rxjs';
import { TodoElement } from '../../models/todo-element';
import { TagValue } from '../../enums/tag-values';
import { TagService } from '../../services/tag.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css',
  // providers: [MessageService]
})
export class TodosListComponent implements OnInit, OnDestroy {
  @Input() todosList: TodoElement[] = [];
  todosToDisplay: TodoElement[] = [];
  TagValue = TagValue;
  error: String = "";
  private errorSub!: Subscription;

  constructor(private dataService: DataService, private tagService: TagService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadTodos();
    this.errorSub = this.tagService.errorSub.subscribe(errorMessage => {
      this.error = errorMessage;
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onLoadTodos() {
    this.loadTodos();
  }

  async onAssignTodosForWeek(weekTagValue: TagValue) {
    const weekTag = await this.tagService.getTag(weekTagValue);
    let selectedTodos = this.todosList.filter(todo => todo.isSelected);
    selectedTodos.forEach(todo => {
      if (todo.tags.map(t => t.name).includes(weekTagValue)) {
        const details = 'Todo ' + todo.taskName + ' już jest oznaczone tagiem: ' + weekTagValue + '\n';
        this.messageService.add({ severity: 'warn', summary: 'Dodawanie taga', detail: details });
        return;
      }
      if (weekTag) {
        this.dataService.assignTagForTodo(todo, weekTag)
        .subscribe(response => {
          console.log(response);
          if (response.success === true)
            this.messageService.add({ severity: 'success', summary: 'Dodawanie taga', detail: 'Dodawanie OK' });
          else
            this.messageService.add({ severity: 'error', summary: 'Dodawanie taga', detail: 'Dodawanie Zjebane:\n' + response, sticky: true });
        })
      } else {
        const details = 'Użytkownik nie posiada zdefiniowanego taga ' + weekTagValue + ' w Habitice';
        this.messageService.add({ severity: 'error', summary: 'Dodawanie taga', detail: details, life: 5000 });
      }
    });

    // Refresh todos from DB
    this.loadTodos();
  }

  onShowCurrentWeekTodos() {
    this.todosToDisplay = this.getCurrentWeekTodos();
  }

  onShowNextWeekTodos() {
    this.todosToDisplay = this.getNextWeekTodos();
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

  private loadTodos(): void {
    this.dataService.fetchTodos()
    .subscribe(
      response => {
        this.todosList = response;
        this.todosToDisplay = response;
      }
    );
  }

  private getNextWeekTodos(): TodoElement[] {
    this.todosToDisplay = this.todosList;
    return this.todosToDisplay.filter(t => t.tags.find(tag => tag.name == TagValue.NextWeek));
  }

  private getCurrentWeekTodos(): TodoElement[] {
    this.todosToDisplay = this.todosList;
    return this.todosToDisplay.filter(t => t.tags.find(tag => tag.name == TagValue.CurrentWeek));
  }
}
