import { Tag } from "./tag";
import { Todo } from "./todo";

export class TodoElement implements Todo {
    taskId: string;
    taskName: string;
    tags: Tag[];
    isSelected: boolean;

    constructor(id: string, name: string, tags: Tag[], selected?: boolean) {
        this.taskId = id;
        this.taskName = name;
        this.tags = tags;
        this.isSelected = selected ?? false;       
    }

}