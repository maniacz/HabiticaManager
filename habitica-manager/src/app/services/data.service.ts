import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  todosUrl: string = "https://localhost:7248/todos";

  constructor(private http: HttpClient) { }

  fetchTodos() :Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl);
  }
}
