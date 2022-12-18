export enum TaskIterationPeriodEnum {
  Today = "Today",
  Tomorrow = "Tomorrow",
  Upcoming = "Upcoming",
  Someday = "Someday",
  All = "All",
}

export function periodToIndex(taskPeriod: TaskIterationPeriodEnum): number {
  switch (taskPeriod) {
    case TaskIterationPeriodEnum.Today:
      return 0;
    case TaskIterationPeriodEnum.Tomorrow:
      return 1;
    case TaskIterationPeriodEnum.Upcoming:
      return 2;
    case TaskIterationPeriodEnum.Someday:
      return 3;
    case TaskIterationPeriodEnum.All:
      return 4;
    default:
      throw new Error(`Unknown task iteration period enum value: ${taskPeriod}`);
  }
}

export function indexToPeriod(index: number): TaskIterationPeriodEnum {
  switch (index) {
    case 0:
      return TaskIterationPeriodEnum.Today;
    case 1:
      return TaskIterationPeriodEnum.Tomorrow;
    case 2:
      return TaskIterationPeriodEnum.Upcoming;
    case 3:
      return TaskIterationPeriodEnum.Someday;
    case 4:
      return TaskIterationPeriodEnum.All;
    default:
      throw new Error(`Unknown task iteration period enum value: ${index}`);
  }
}

export function periodToArray(): TaskIterationPeriodEnum[] {
  return [
    TaskIterationPeriodEnum.Today,
    TaskIterationPeriodEnum.Tomorrow,
    TaskIterationPeriodEnum.Upcoming,
    TaskIterationPeriodEnum.Someday,
    TaskIterationPeriodEnum.All,
  ];
}
