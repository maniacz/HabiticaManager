import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { Subject, firstValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { TagValue } from '../enums/tag-values';
import { TodoElement } from '../models/todo-element';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  errorSub = new Subject<string>();

  constructor(private dataService: DataService, private messageService: MessageService) { }

  async getTag(tagName: string): Promise<Tag | undefined> {
    const allTags = await firstValueFrom(this.dataService.fetchTags());
    return allTags.find(t => t.name === tagName);
  }

  async removeNextWeekTagFromTodo(todo: TodoElement) {
    const nextWeekTag = await this.getTag(TagValue.NextWeek);
    if (nextWeekTag) {
      this.dataService.removeTagFromTodo(todo, nextWeekTag).subscribe(
        response => {},
        error => {
          this.errorSub.next(error.error);
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Usuwanie taga', detail: 'Nie został prawidłowo pobrany tag nextWeekTag' });
    }
  }

  async assignCurrentWeekTagForTodo(todo: TodoElement) {
    const currentWeekTag = await this.getTag(TagValue.CurrentWeek);
    if (currentWeekTag) {
      this.dataService.assignTagForTodo(todo, currentWeekTag).subscribe(
        response => {},
        error => {
          this.errorSub.next(error.error);
        }
      )
    } else {
      this.messageService.add({ severity: 'error', summary: 'Dodawanie taga', detail: 'Nie został prawidłowo pobrany tag currentWeekTag' });
    }
  }
}
