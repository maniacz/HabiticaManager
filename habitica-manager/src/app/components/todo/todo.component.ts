import { Component, Input } from '@angular/core';
import { Tag } from '../../models/tag';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  @Input() taskName: string = "";
  @Input() assignedTags: Tag[] = [];
  isSelected: boolean = false;
}
