import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tag } from '../../models/tag';
import { DataService } from '../../services/data.service';
import { timeout } from 'rxjs';
import { OutletContext } from '@angular/router';
import { FilterTodoEventArgs } from '../../models/filter-todos-event-args';

@Component({
  selector: 'app-tag-filters',
  templateUrl: './tag-filters.component.html',
  styleUrl: './tag-filters.component.scss',
  standalone: false,
})
export class TagFiltersComponent implements OnInit {
  tags: Tag[] = [];
  selectedTodosWithOnlySelectedTags: boolean = true;
  selectedTagNames: string[] = [];
  @Output() filterTodos = new EventEmitter<FilterTodoEventArgs>();


  mockTags: Tag[] = [
    {
        id: "958a73fb-d341-4513-83c2-c90c318193b5",
        name: "dom",
        emoji: undefined
    },
    {
        id: "f7ca5e48-7471-4bc3-ae65-baeba2fafa4c",
        name: "praca",
        emoji: undefined
    },
    {
        id: "7f74cad0-bd54-45ba-9562-9e590032e421",
        name: "zakupy",
        emoji: undefined
    },
    {
        id: "1772fd30-54ed-4aa8-bc8a-13b09479af36",
        name: "calendar",
        emoji: undefined
    },
    {
        id: "06e300d7-c8df-404b-be6b-c5b6eb6cf570",
        name: "project",
        emoji: undefined
    },
    {
        id: "981f7a2c-fe2d-4484-b994-996868f6f251",
        name: "przy kompie",
        emoji: undefined
    },
    {
        id: "244ccf0f-f6ee-4f4c-b378-f53e78019ce5",
        name: "kontakt",
        emoji: undefined
    },
    {
        id: "43e8cc3a-5e0b-48e0-9055-f37ba95b3a17",
        name: "piwowarstwo",
        emoji: undefined
    },
    {
        id: "16563dbf-d923-45a1-b6f8-d9f84aaf3f87",
        name: "do obejrzenia",
        emoji: undefined
    },
    {
        id: "af002b2b-9ed1-49fe-826b-e24f10418dd2",
        name: "inwestycje",
        emoji: undefined
    },
    {
        id: "2995fb09-6228-4388-9082-7fc657fd7a85",
        name: "pilne ważne",
        emoji: undefined
    },
    {
        id: "a62cb803-194d-4f1a-8bc2-a4ca8ecefc54",
        name: "niepilne ważne",
        emoji: undefined
    },
    {
        id: "d6443523-2d24-42bb-9136-88ae0d025ef0",
        name: "niepilne nieważne",
        emoji: undefined
    },
    {
        id: "0cfe6cb2-003c-4eaa-8d12-177aee36ec3f",
        name: "pilne nieważne",
        emoji: undefined
    },
    {
        id: "71eb1d61-2ae5-4cf8-808c-c51647a14a08",
        name: "w trasie",
        emoji: undefined
    },
    {
        id: "021a622f-6d7d-493b-ad45-15a42c28a9a3",
        name: "wyszukaj info/wygooglaj",
        emoji: undefined
    }
]
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchTags()
    .subscribe(response => {
      this.tags = response;
    })

    // setTimeout(() => {
    //   console.log(this.tags);
    // }, 2000);

    // this.tags = this.mockTags
  }

  onChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const tagName = (event.target as HTMLInputElement).value;
    console.log(tagName);
    if (isChecked) {
        this.selectedTagNames.push(tagName);
    } else {
        const index = this.selectedTagNames.indexOf(tagName);
        this.selectedTagNames.splice(index, 1);
    }
    console.log(this.selectedTagNames);
  }

  onFilterTodos() {
    console.log('Selected tags: ' + this.selectedTagNames);
    console.log('Selected ALL: ' + this.selectedTodosWithOnlySelectedTags);
    const eventArgs = new FilterTodoEventArgs(this.selectedTodosWithOnlySelectedTags, this.selectedTagNames);
    this.filterTodos.emit(eventArgs);
  }
}
