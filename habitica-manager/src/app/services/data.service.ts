import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { Todo } from '../models/todo';
import { Tag } from '../models/tag';
import { Result } from '../models/api-result';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TagValue } from '../enums/tag-values';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  todosUrl: string = "https://localhost:7248/todos";
  tagsUrl: string = "https://localhost:7248/tags";
  setTagUrl: string = "https://localhost:7248/addtag";

  filterTodos = signal<Date | null>(null);
  
  constructor(private http: HttpClient) { }

  private todosResult$ = toObservable(this.filterTodos)
    .pipe(
      switchMap(() => {
        return this.http.get<Todo[]>(this.todosUrl)
          .pipe(
            map(todos => ({ 
              data: todos,
              success: true
              } as Result<Todo[]>)),
            catchError(err => of({
              data: [],
              error: err,
              success: false
              } as Result<Todo[]>))
          );
      })
    );


  private todosResult = toSignal(this.todosResult$, { initialValue: { data: [], success: false } as Result<Todo[]>});
  todos = computed(() => signal(this.todosResult().data));
  todosError = computed(() => this.todosResult().error);

  todosToDisplay = computed(() => this.todos()())

  private getAllTodosSubject = new BehaviorSubject<Result<Todo[]>>({ data: [], success: false });
  getAllTodos$ = this.getAllTodosSubject.asObservable();
  
  getCurrentWeekTodos() {
    this.todos().set(this.todosResult().data);
    this.todos().update(t => t?.filter(t => t.tags.find(tag => tag.name == TagValue.CurrentWeek)));
  }

  getNextWeekTodos() {
    this.todos().set(this.todosResult().data);
    this.todos().update(t => t?.filter(t => t.tags.find(tag => tag.name == TagValue.NextWeek)));
  }

  getAllTodos() {
    const dateTime = new Date();
    this.filterTodos.set(dateTime);
  }


  fetchTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl);
  }

  fetchTags(): Observable<Tag[]> {
    return this.http.get<TagsResponse>(this.tagsUrl)
    .pipe(map(response => response.data))
  }

  assignTagForTodo(todo: Todo, tag: Tag): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('todoId', todo.taskId)
    queryParams = queryParams.append('tagId', tag.id)

    return this.http.post(this.setTagUrl, null, {
      params: queryParams
    }).pipe(
      catchError(this.handleError)
    );
  }

  removeTagFromTodo(todo: Todo, tag: Tag) {
    const removeTagUrl = `https://localhost:7248/removetagfromtodo/${todo.taskId}/${tag.id}`;
    return this.http.delete(removeTagUrl)
  }

  // Filters todos returnig todos containing tags only with provided tagNames or with provided tagNames and other tags
  filterTodosByTags(tagNames: string[], onlySelectedTags: boolean) {
    this.todos().set(this.todosResult().data);
    this.todos().update(todos => {
      todos = todos?.filter(todo => todo.tags.length > 0)
      if (onlySelectedTags) {
        return todos?.filter(todo => todo.tags.map(t => t.name).every(t => tagNames.includes(t) && tagNames.length === todo.tags.length))
      } else {
        return todos?.filter(todo => tagNames.every(tagName => todo.tags.map(t => t.name).includes(tagName)))
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
}