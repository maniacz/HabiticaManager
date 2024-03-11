import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) { }

  fetchTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl);
  }

  fetchTags(): Observable<Tag[]> {
    return this.http.get<TagsResponse>(this.tagsUrl)
    .pipe(map(response => response.data))
  }
}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
}
