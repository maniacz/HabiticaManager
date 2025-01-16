import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../models/tag';
import { TodoEmojiValidatorService } from '../../services/todo-emoji-validator.service';
import { TodoValidationResult } from '../../models/todo-validation-result';
import { TodoValidation } from '../../enums/todo-validation';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  standalone: false,
})
export class TodoComponent implements OnInit {
  @Input() taskName: string = "";
  @Input() assignedTags: Tag[] = [];
  @Input() isSelected: boolean = false;
  @Output() isSelectedChange = new EventEmitter<boolean>();
  validationResult!: TodoValidationResult;

  constructor(private todoEmojiValidator: TodoEmojiValidatorService) {}

  ngOnInit(): void {
    this.validationResult = this.todoEmojiValidator.validate(this.taskName, this.assignedTags);
  }

  setBackgroundColor() {
    switch (this.validationResult.result) {
      case TodoValidation.Valid:
        return 'transparent';
      case TodoValidation.missingAssignedTags:
        return 'red';
      case TodoValidation.missingEmojis:
        return 'blue';
      case TodoValidation.missingBoth:
        return 'purple';
      default:
        // todo: handle error
        return 'green'
    }
  }

  onChange() {
    this.isSelectedChange.emit(this.isSelected);
  }
}
