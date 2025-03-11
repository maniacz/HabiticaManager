import { Component, Signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { TagService } from '../../services/tag.service';
import { MessageService } from 'primeng/api';
import { TagValue } from '../../enums/tag-values';
import { Subscription } from 'rxjs';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todos-manager',
  templateUrl: './todos-manager.component.html',
  styleUrl: './todos-manager.component.scss',
  standalone: false,
})
export class TodosManagerComponent {
  TagValue = TagValue;
  error: String = "";
  private errorSub!: Subscription;
  todos: Signal<Todo[] | undefined>;

  constructor(private dataService: DataService, private tagService: TagService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.dataService.getAllTodos();
    this.errorSub = this.tagService.errorSub.subscribe(errorMessage => {
      this.error = errorMessage;
    });
    this.todos = this.dataService.todosToDisplay;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onLoadTodos() {
    this.dataService.getAllTodos();
    console.log('onLoadTodos Loaded todos: ' + JSON.stringify(this.todos(), null, 2));
  }

  async onAssignTodosForWeek(weekTagValue: TagValue) {
    const weekTag = await this.tagService.getTag(weekTagValue);
    let selectedTodos = this.todos()?.filter(todo => todo.isSelected);
    selectedTodos?.forEach(todo => {
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
    // this.loadTodos();
  }

  onConvertNextWeekTodosToCurrentWeek() {
    const nextWeekTodos = this.getNextWeekTodos();
    // nextWeekTodos.forEach(todo => {
    //   this.tagService.removeNextWeekTagFromTodo(todo);
    //   this.tagService.assignCurrentWeekTagForTodo(todo);
    // });
  }

  onHandleError() {
    this.error = "";
  }

  getNextWeekTodos() {
    this.dataService.getNextWeekTodos();
  }

  getCurrentWeekTodos() {
    this.dataService.getCurrentWeekTodos();
  }
}
