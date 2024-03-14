import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Todo } from '../models/todo';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  todosUrl: string = "https://localhost:7248/todos";
  tagsUrl: string = "https://localhost:7248/tags";
  setTagUrl: string = "https://localhost:7248/addtag";

  constructor(private http: HttpClient) { }

  fetchTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl);
  }

  fetchTags(): Observable<Tag[]> {
    return this.http.get<TagsResponse>(this.tagsUrl)
    .pipe(map(response => response.data))
  }

  assignCurrentWeekTagForTodo(todo: Todo, currentWeekTag: Tag): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('todoId', todo.taskId)
    queryParams = queryParams.append('tagId', currentWeekTag.id)

    return this.http.post(this.setTagUrl, null, {
      params: queryParams
    })
  }
}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
}
