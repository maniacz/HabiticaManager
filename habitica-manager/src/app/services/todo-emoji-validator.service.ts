import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { TodoValidationResult } from '../models/todo-validation-result';
import { TodoValidation } from '../enums/todo-validation';

@Injectable({
  providedIn: 'root'
})
export class TodoEmojiValidatorService {
  emojiTag = new Map<string, Tag>([
    ['house', { id: '958a73fb-d341-4513-83c2-c90c318193b5', name: 'dom' }],
    ['office', { id: 'f7ca5e48-7471-4bc3-ae65-baeba2fafa4c', name: 'praca' }],
    ['handbag', { id: '7f74cad0-bd54-45ba-9562-9e590032e421', name: 'zakupy' }],
    ['!??', { id: '1772fd30-54ed-4aa8-bc8a-13b09479af36', name: 'calendar' }],
    ['???', { id: '06e300d7-c8df-404b-be6b-c5b6eb6cf570"', name: 'project' }],
    ['floppy_disk', { id: '981f7a2c-fe2d-4484-b994-996868f6f251', name: 'przy kompie' }],
    ['phone', { id: '244ccf0f-f6ee-4f4c-b378-f53e78019ce5', name: 'kontakt' }],
    ['beer', { id: '43e8cc3a-5e0b-48e0-9055-f37ba95b3a17', name: 'piwowarstwo' }],
    ['tv', { id: '16563dbf-d923-45a1-b6f8-d9f84aaf3f87', name: 'do obejrzenia' }],
    ['moneybag', { id: 'af002b2b-9ed1-49fe-826b-e24f10418dd2', name: 'inwestycje' }],
    ['bangbang', { id: '2995fb09-6228-4388-9082-7fc657fd7a85', name: 'pilne ważne' }],
    ['warning', { id: 'a62cb803-194d-4f1a-8bc2-a4ca8ecefc54', name: 'niepilne ważne' }],
    ['x', { id: 'd6443523-2d24-42bb-9136-88ae0d025ef0', name: 'niepilne nieważne' }],
    ['exclamation', { id: '0cfe6cb2-003c-4eaa-8d12-177aee36ec3f', name: 'pilne nieważne' }],
    ['car', { id: '71eb1d61-2ae5-4cf8-808c-c51647a14a08', name: 'w trasie' }],
    ['mag', { id: '021a622f-6d7d-493b-ad45-15a42c28a9a3', name: 'wyszukaj info/wygooglaj' }],
  ]);

  constructor() { }

  validate(taskName: string, assignedTags: Tag[]): TodoValidationResult {
    const taskNameSubStrings = taskName.split(':');
    let missingAssignedTags: Tag[] = [];
    let missingEmojis: Tag[] = [];
    let tagsIncludedInTaskName: Tag[] = [];
    let result: TodoValidationResult;

    // Detect tags included in task name
    taskNameSubStrings.forEach(taskNamePart => {
      this.emojiTag.forEach((value, key, map) => {
        if (taskNamePart === key) {
          tagsIncludedInTaskName.push(new TagItem(value.id, value.name, key))
        }
      })
    })
    
    // Detect missing assigned tags included in task name
    tagsIncludedInTaskName.forEach(tagInTaskName => {
      const tagsFound = assignedTags.filter(assignedTag => assignedTag.name === tagInTaskName.name)
      if (tagsFound.length === 0) {
        missingAssignedTags.push(tagInTaskName);
      }
    });
    
    // Detect missing emojis
    assignedTags.forEach(assignedTag => {
      const tagsFound = tagsIncludedInTaskName.filter(tagInTaskName => tagInTaskName.name === assignedTag.name)
      if (tagsFound.length === 0) {
        missingEmojis.push(assignedTag)
      }
    });

    result = { result: TodoValidation.Valid };
    if (missingAssignedTags.length > 0) {
      result = { result: TodoValidation.missingAssignedTags, missingAssignedTags: missingAssignedTags }
    }
    if (missingEmojis.length > 0) {
      result = { result: TodoValidation.missingEmojis, missingEmojis: missingEmojis }
    }
    if (missingAssignedTags.length > 0 && missingEmojis.length > 0) {
      result = { result: TodoValidation.missingBoth, missingAssignedTags: missingAssignedTags, missingEmojis: missingEmojis }
    }
    return result;
  }
}

export class TagItem implements Tag {
  id: string;
  name: string;
  emoji?: string | undefined;

  constructor(tagId: string, tagName: string, tagEmoji?: string) {
    this.id = tagId;
    this.name = tagName;
    this.emoji = tagEmoji;
  }
}
