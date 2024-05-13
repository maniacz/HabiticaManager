import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { Subject, firstValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { TagValue } from '../enums/tag-values';
import { TodoElement } from '../models/todo-element';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  error = new Subject<string>();

  constructor(private dataService: DataService) { }

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
          this.error.next(error.error);
        }
      );
    } else {
      //TODO: Wyrzuć alert, że nie pobrało nextWeekTag
    }
  }
}
