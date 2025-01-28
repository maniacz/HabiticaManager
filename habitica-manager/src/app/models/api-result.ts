export interface Result<T> {
    data: T | undefined;
    error?: string;
    success: boolean;
}