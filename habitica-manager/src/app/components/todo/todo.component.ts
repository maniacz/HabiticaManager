import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../models/tag';
import { TodoEmojiValidatorService } from '../../services/todo-emoji-validator.service';
import { TodoValidationResult } from '../../models/todo-validation-result';
import { TodoValidation } from '../../enums/todo-validation';
import emoji from 'emoji-dictionary';

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
  emojiText = String.fromCodePoint(0x1F602) + " " + String.fromCodePoint(0x1F4BB) + " " + String.fromCodePoint(0x1F60A);

  constructor(private todoEmojiValidator: TodoEmojiValidatorService) {}

  ngOnInit(): void {
    this.validationResult = this.todoEmojiValidator.validate(this.taskName, this.assignedTags);
    this.convertTextToEmoji(this.taskName);
  }

  convertTextToEmoji(text: string) {
    // Find all emoji text surrounded by colons in the task name
    const regEx = /:([^\s:]+):/g;
    const matches = text.match(regEx)
    matches?.forEach((match) => {
      // Strip surrounding colons
      const emojiText = match.slice(1, -1);
      console.log(emojiText);
      const unicode = emoji.getUnicode(emojiText);
      console.log(unicode);
      // Replace emoji text with emoji
      text = text.replace(match, unicode);
      console.log(text);
      this.taskName = text;
    });
}

  setBackgroundColor() {
    switch (this.validationResult.result) {
      case TodoValidation.Valid:
        return 'rgb(209, 209, 209)';
      case TodoValidation.missingAssignedTags:
        return 'pink';
      case TodoValidation.missingEmojis:
        return 'lightblue';
      case TodoValidation.missingBoth:
        return 'yellow';
      default:
        // todo: handle error
        return 'green'
    }
  }

  onChange() {
    this.isSelectedChange.emit(this.isSelected);
  }
}
