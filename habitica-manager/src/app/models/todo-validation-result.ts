import { TodoValidation } from "../enums/todo-validation";
import { Tag } from "./tag";

export interface TodoValidationResult {
    result: TodoValidation;
    missingAssignedTags?: Tag[];
    missingEmojis?: Tag[];
}