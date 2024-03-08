import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  todosUrl: string = "https://localhost:7248/todos";

  constructor(private http: HttpClient) { }

  fetchTodos() {
    this.http.get(this.todosUrl);
  }
}
