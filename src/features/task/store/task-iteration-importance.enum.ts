export enum TaskIterationImportanceEnum {
  High = "High",
  Medium = "Medium",
  Ordinary = "Ordinary",
  Low = "Low",
}

export function ImportanceToIndex(taskIterationImportance: TaskIterationImportanceEnum): number {
  switch (taskIterationImportance) {
    case TaskIterationImportanceEnum.High:
      return 0;
    case TaskIterationImportanceEnum.Medium:
      return 1;
    case TaskIterationImportanceEnum.Ordinary:
      return 2;
    case TaskIterationImportanceEnum.Low:
      return 3;
    default:
      throw new Error(`Unknown task iteration importance enum value: ${taskIterationImportance}`);
  }
}

export function indexToImportance(index: number): TaskIterationImportanceEnum {
  switch (index) {
    case 0:
      return TaskIterationImportanceEnum.High;
    case 1:
      return TaskIterationImportanceEnum.Medium;
    case 2:
      return TaskIterationImportanceEnum.Ordinary;
    case 3:
      return TaskIterationImportanceEnum.Low;
    default:
      throw new Error(`Unknown task iteration importance index value: ${index}`);
  }
}

export function importanceToArray(): TaskIterationImportanceEnum[] {
  return [
    TaskIterationImportanceEnum.High,
    TaskIterationImportanceEnum.Medium,
    TaskIterationImportanceEnum.Ordinary,
    TaskIterationImportanceEnum.Low,
  ];
}

export function importanceToColor(importance: TaskIterationImportanceEnum): string | undefined {
  switch (importance) {
    case TaskIterationImportanceEnum.High:
      return "danger";
    case TaskIterationImportanceEnum.Medium:
      return "warning";
    case TaskIterationImportanceEnum.Ordinary:
      return "primary";
    case TaskIterationImportanceEnum.Low:
      return undefined;
    default:
      throw new Error(`Unknown task iteration importance enum value: ${importance}`);
  }
}
