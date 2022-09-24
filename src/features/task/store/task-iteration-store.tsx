import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";
import { nanoid } from "nanoid";
import {
    TaskIterationPeriodEnum,
} from "./task-iteration-period-enum";
import {
    importanceToPrice,
    priceToNumber,
} from "./task-iteration-price-enum";
import {
    TaskIterationImportanceEnum,
    importanceToArray,
} from "./task-iteration-importance-enum";
import { TaskRepeatKindEnum } from "./task-repeat-kind-enum";

export interface TaskIteration {
    id: string;
    taskId: string;
    date?: Date;
    importance: TaskIterationImportanceEnum;
    completed: boolean;
    completedDate: Date | undefined;
}

export type TaskIterationEditable = Pick<TaskIteration, "taskId" | "date" | "importance">;

export interface TaskIterationStoreSlice {
    taskIterationSlice: {
        taskIterations: TaskIteration[];
        add: (taskIterationEditable: TaskIterationEditable) => void;
        remove: (taskIterationId: string) => void;
        update: (taskIterationId: string, taskIterationEditable: TaskIterationEditable) => void;
        toggle: (taskIterationId: string) => void;
    };
}

export const createTaskIterationStoreSlice: StateCreator<
    Store,
    Mutators,
    [],
    TaskIterationStoreSlice
> = (set) => ({
    taskIterationSlice: {
        taskIterations: [],

        add: (taskIterationEditable) =>
            set((state) => {
                state.taskIterationSlice.taskIterations.push({
                    id: nanoid(),
                    taskId: taskIterationEditable.taskId,
                    date: taskIterationEditable.date,
                    importance: taskIterationEditable.importance,
                    completed: false,
                    completedDate: undefined,
                });

                // TODO: notification
            }),

        remove: (taskIterationId) =>
            set((state) => {
                state.taskIterationSlice.taskIterations = state.taskIterationSlice.taskIterations.filter(
                    (taskIteration) => taskIteration.id !== taskIterationId,
                );
            }),

        update: (taskIterationId, taskIterationEditable) =>
            set((state) => {
                const taskIteration = state.taskIterationSlice.taskIterations.find(
                    (taskIteration) => taskIteration.id === taskIterationId,
                );

                if (!taskIteration) {
                    throw new Error(`TaskIteration with id ${taskIterationId} not found`);
                }

                taskIteration.date = taskIterationEditable.date ?? taskIteration.date;
                taskIteration.importance = taskIterationEditable.importance ?? taskIteration.importance;
            }),

        toggle: (taskIterationId) =>
            set((state) => {
                const taskIteration = state.taskIterationSlice.taskIterations.find(
                    (taskIteration) => taskIteration.id === taskIterationId,
                );
                if (!taskIteration) {
                    throw new Error(`TaskIteration with id ${taskIterationId} not found`);
                }

                taskIteration.completed = !taskIteration.completed;
                taskIteration.completedDate = taskIteration.completed ? new Date() : undefined;

                const task = state.taskSlice.tasks.find((task) => task.id === taskIteration.taskId);

                if (!task) {
                    throw new Error(`Task with id ${taskIteration.taskId} not found`);
                }

                task.completedTimes += taskIteration.completed ? 1 : -1;

                const completed = state.taskSlice.completed(taskIteration.taskId);

                if (task.dreamId) {
                    state.dreamSlice.tryComplete(task.dreamId);
                }

                if (!completed && taskIteration.date) {
                    state.taskIterationSlice.add({
                        taskId: task.id,
                        date: getNextTaskIterationDate(taskIteration.date, task.repeatKind),
                        importance: taskIteration.importance,
                    });
                }
            }),
    },
});

export function filterTaskIterations(
    taskIterations: TaskIteration[],
    period: TaskIterationPeriodEnum,
): TaskIteration[] {
    const now = new Date();
    let periodFilterFn: (taskIterationA: TaskIteration) => boolean;

    switch (period) {
        case TaskIterationPeriodEnum.Today:
            periodFilterFn = (taskIteration: TaskIteration) => {
                return (
                    now.getFullYear() === taskIteration.date?.getFullYear() &&
                    now.getMonth() === taskIteration.date?.getMonth() &&
                    now.getDate() === taskIteration.date?.getDate()
                );
            };
            break;
        case TaskIterationPeriodEnum.Tomorrow:
            periodFilterFn = (taskIteration: TaskIteration) => {
                return (
                    now.getFullYear() === taskIteration.date?.getFullYear() &&
                    now.getMonth() === taskIteration.date?.getMonth() &&
                    now.getDate() + 1 === taskIteration.date?.getDate()
                );
            };
            break;
        case TaskIterationPeriodEnum.Upcoming:
            periodFilterFn = (taskIteration: TaskIteration) => {
                return (
                    now.getFullYear() === taskIteration.date?.getFullYear() &&
                    now.getMonth() === taskIteration.date?.getMonth() &&
                    now.getDate() + 1 < taskIteration.date?.getDate()
                );
            };
            break;
        case TaskIterationPeriodEnum.Someday:
            periodFilterFn = (taskIteration: TaskIteration) => !taskIteration.date;
            break;
        case TaskIterationPeriodEnum.All:
            periodFilterFn = () => true;
            break;
    }

    return taskIterations.filter(periodFilterFn);
}

export function sortTaskIterations(taskIterations: TaskIteration[]) {
    const taskImportanceArray = importanceToArray();

    return taskIterations
        .sort(
            (a, b) =>
                taskImportanceArray.indexOf(a.importance) - taskImportanceArray.indexOf(b.importance),
        )
        .sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
}

export function getTaskIterationsLoad(taskIterations: TaskIteration[]): number {
    return taskIterations
        .map((taskIteration) =>
            priceToNumber(
                importanceToPrice(taskIteration.importance),
            ),
        )
        .reduce((load, price) => load + price, 0);
}

function getNextTaskIterationDate(date: Date, taskRepeatKind: TaskRepeatKindEnum): Date {
    const nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    switch (taskRepeatKind) {
        case TaskRepeatKindEnum.None:
            throw new Error("TaskRepeatKindEnum.None is not supported");
        case TaskRepeatKindEnum.Daily:
            return nextDay;
        case TaskRepeatKindEnum.Weekdays:
            while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
                nextDay.setDate(nextDay.getDate() + 1);
            }

            return nextDay;
        case TaskRepeatKindEnum.Weekends:
            while (nextDay.getDay() !== 0 && nextDay.getDay() !== 6) {
                nextDay.setDate(nextDay.getDate() + 1);
            }

            return nextDay;
        case TaskRepeatKindEnum.Weekly:
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
        case TaskRepeatKindEnum.Monthly:
            return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        case TaskRepeatKindEnum.Yearly:
            return new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    }
}
