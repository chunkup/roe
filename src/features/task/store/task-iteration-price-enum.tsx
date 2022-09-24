import { TaskIterationImportanceEnum } from "./task-iteration-importance-enum";

export enum TaskIterationPriceEnum {
  High = 6,
  Medium = 4,
  Ordinary = 3,
  Low = 2,
}

export function importanceToPrice(taskIterationImportance: TaskIterationImportanceEnum): TaskIterationPriceEnum {
  switch (taskIterationImportance) {
    case TaskIterationImportanceEnum.High:
      return TaskIterationPriceEnum.High;
    case TaskIterationImportanceEnum.Medium:
      return TaskIterationPriceEnum.Medium;
    case TaskIterationImportanceEnum.Ordinary:
      return TaskIterationPriceEnum.Ordinary;
    case TaskIterationImportanceEnum.Low:
      return TaskIterationPriceEnum.Low;
    default:
      throw new Error(`Unknown task iteration importance enum value: ${taskIterationImportance}`);
  }
}

export function priceToNumber(taskIterationPrice: TaskIterationPriceEnum): number {
  switch (taskIterationPrice) {
    case TaskIterationPriceEnum.High:
      return 6;
    case TaskIterationPriceEnum.Medium:
      return 4;
    case TaskIterationPriceEnum.Ordinary:
      return 3;
    case TaskIterationPriceEnum.Low:
      return 2;
    default:
      throw new Error(`Unknown task iteration price enum value: ${taskIterationPrice}`);
  }
}