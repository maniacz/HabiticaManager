import { Tag } from "./tag";

export interface Todo {
    taskId: string;
    taskName: string;
    tags: Tag[];
    isSelected: boolean;
}