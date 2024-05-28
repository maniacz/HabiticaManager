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

  constructor(private dataService: DataService, private tagService: TagService) {}

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

  private loadTodos(): void {
    this.dataService.fetchTodos()
    .subscribe(
      response => {
        this.todosList = response;
      }
    );
  }

  private getNextWeekTodos(): TodoElement[] {
    return this.todosList.filter(t => t.tags.find(tag => tag.name == TagValue.NextWeek));
  }

  private getCurrentWeekTodos(): TodoElement[] {
    return this.todosList.filter(t => t.tags.find(tag => tag.name == TagValue.CurrentWeek));
  }
}
