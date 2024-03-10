import { TestBed } from '@angular/core/testing';

import { TodoEmojiValidatorService } from './todo-emoji-validator.service';

describe('TodoEmojiValidatorService', () => {
  let service: TodoEmojiValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoEmojiValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
