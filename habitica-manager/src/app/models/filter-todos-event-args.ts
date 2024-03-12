export class FilterTodoEventArgs {
    selectedFilterContainingAllTags: boolean = true;
    selectedTagNames: string[] = [];

    constructor(containingAllTags: boolean, tagNames: string[]) {
        this.selectedFilterContainingAllTags = containingAllTags;
        this.selectedTagNames = tagNames;
    }
}