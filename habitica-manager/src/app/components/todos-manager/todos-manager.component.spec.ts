import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosManagerComponent } from './todos-manager.component';

describe('TodosManagerComponent', () => {
  let component: TodosManagerComponent;
  let fixture: ComponentFixture<TodosManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodosManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodosManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
