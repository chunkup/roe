export enum TaskPeriodEnum {
  Today = "Today",
  Tomorrow = "Tomorrow",
  Upcoming = "Upcoming",
  Someday = "Someday",
  All = "All",
}

export function periodToIndex(taskPeriod: TaskPeriodEnum): number {
  switch (taskPeriod) {
    case TaskPeriodEnum.Today:
      return 0;
    case TaskPeriodEnum.Tomorrow:
      return 1;
    case TaskPeriodEnum.Upcoming:
      return 2;
    case TaskPeriodEnum.Someday:
      return 3;
    case TaskPeriodEnum.All:
      return 4;
    default:
      throw new Error(`Unknown task period enum value: ${taskPeriod}`);
  }
}

export function indexToPeriod(index: number): TaskPeriodEnum {
  switch (index) {
    case 0:
      return TaskPeriodEnum.Today;
    case 1:
      return TaskPeriodEnum.Tomorrow;
    case 2:
      return TaskPeriodEnum.Upcoming;
    case 3:
      return TaskPeriodEnum.Someday;
    case 4:
      return TaskPeriodEnum.All;
    default:
      throw new Error(`Unknown task period enum value: ${index}`);
  }
}

export function periodToArray(): TaskPeriodEnum[] {
  return [
    TaskPeriodEnum.Today,
    TaskPeriodEnum.Tomorrow,
    TaskPeriodEnum.Upcoming,
    TaskPeriodEnum.Someday,
    TaskPeriodEnum.All,
  ];
}
