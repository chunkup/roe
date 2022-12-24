export enum TaskImportanceEnum {
  High = "High",
  Medium = "Medium",
  Ordinary = "Ordinary",
  Low = "Low",
}

export function ImportanceToIndex(taskImportance: TaskImportanceEnum): number {
  switch (taskImportance) {
    case TaskImportanceEnum.High:
      return 0;
    case TaskImportanceEnum.Medium:
      return 1;
    case TaskImportanceEnum.Ordinary:
      return 2;
    case TaskImportanceEnum.Low:
      return 3;
    default:
      throw new Error(`Unknown task importance enum value: ${taskImportance}`);
  }
}

export function indexToImportance(index: number): TaskImportanceEnum {
  switch (index) {
    case 0:
      return TaskImportanceEnum.High;
    case 1:
      return TaskImportanceEnum.Medium;
    case 2:
      return TaskImportanceEnum.Ordinary;
    case 3:
      return TaskImportanceEnum.Low;
    default:
      throw new Error(`Unknown task importance index value: ${index}`);
  }
}

export function importanceToArray(): TaskImportanceEnum[] {
  return [
    TaskImportanceEnum.High,
    TaskImportanceEnum.Medium,
    TaskImportanceEnum.Ordinary,
    TaskImportanceEnum.Low,
  ];
}

export function importanceToColor(importance: TaskImportanceEnum): string | undefined {
  switch (importance) {
    case TaskImportanceEnum.High:
      return "danger";
    case TaskImportanceEnum.Medium:
      return "warning";
    case TaskImportanceEnum.Ordinary:
      return "primary";
    case TaskImportanceEnum.Low:
      return undefined;
    default:
      throw new Error(`Unknown task importance enum value: ${importance}`);
  }
}
