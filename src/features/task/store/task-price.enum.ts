import { TaskImportanceEnum } from "./task-importance.enum";

export enum TaskPriceEnum {
    High = 6,
    Medium = 4,
    Ordinary = 3,
    Low = 2,
}

export function importanceToPrice(taskImportance: TaskImportanceEnum): TaskPriceEnum {
    switch (taskImportance) {
        case TaskImportanceEnum.High:
            return TaskPriceEnum.High;
        case TaskImportanceEnum.Medium:
            return TaskPriceEnum.Medium;
        case TaskImportanceEnum.Ordinary:
            return TaskPriceEnum.Ordinary;
        case TaskImportanceEnum.Low:
            return TaskPriceEnum.Low;
        default:
            throw new Error(`Unknown task importance enum value: ${taskImportance}`);
    }
}

export function priceToNumber(taskPrice: TaskPriceEnum): number {
    switch (taskPrice) {
        case TaskPriceEnum.High:
            return 6;
        case TaskPriceEnum.Medium:
            return 4;
        case TaskPriceEnum.Ordinary:
            return 3;
        case TaskPriceEnum.Low:
            return 2;
        default:
            throw new Error(`Unknown task price enum value: ${taskPrice}`);
    }
}
