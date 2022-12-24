import { StateCreator } from "zustand";
import { nanoid } from "nanoid";

import { TaskRepeatKindEnum } from "./task-repeat-kind.enum";
import { Mutators, Store } from "../../../store";
import { importanceToArray, TaskImportanceEnum } from "./task-importance.enum";
import { adjustUserBalance } from "../../user/store/user.store";
import { importanceToPrice, priceToNumber } from "./task-price.enum";
import { tryCompleteDream } from "../../dream/store/dream.store";
import { TaskPeriodEnum } from "./task-period.enum";

export interface Task {
    id: string;
    index: number;
    dreamId?: string;
    title: string;
    description?: string;
    repeatKind: TaskRepeatKindEnum;
    repeatTimes: number;
    completed: boolean;
    importance: TaskImportanceEnum;
    date?: Date;
    completedDate?: Date;
}

export type TaskAdd = Pick<Task, "title"> & Partial<Pick<Task, "dreamId" | "description" | "repeatKind" | "repeatTimes" | "index" | "date" | "importance">>;
export type TaskUpdate = Partial<Pick<Task, "title" | "description" | "repeatKind" | "repeatTimes" | "importance" | "date">>;

export interface TaskStoreSlice {
    taskSlice: {
        tasks: Task[];
        add: (taskEditable: TaskAdd) => string;
        remove: (taskId: string) => void;
        update: (taskId: string, taskEditable: TaskUpdate) => void;
        toggle: (taskId: string) => void;
    };
}

export const createTaskStoreSlice: StateCreator<Store, Mutators, [], TaskStoreSlice> = (set) => ({
    taskSlice: {
        tasks: [],

        add: (taskEditable) => {
            const taskId = nanoid();

            set((state) => {
                state.taskSlice.tasks.push({
                    id: taskId,
                    index: taskEditable.index ?? 0,
                    dreamId: taskEditable.dreamId,
                    title: taskEditable.title,
                    description: taskEditable.description,
                    importance: taskEditable.importance ?? TaskImportanceEnum.Ordinary,
                    repeatKind: taskEditable.repeatKind ?? TaskRepeatKindEnum.None,
                    repeatTimes: taskEditable.repeatTimes ?? 1,
                    completed: false,
                });
            });

            return taskId;
        },

        remove: (taskId) =>
            set((state) => {
                state.taskSlice.tasks = state.taskSlice.tasks.filter((task) => task.id !== taskId);
            }),

        update: (taskId, taskEditable) =>
            set((state) => {
                const task = state.taskSlice.tasks.find((task) => task.id === taskId);

                if (!task) {
                    throw new Error(`Task with id ${taskId} not found`);
                }

                task.title = taskEditable.title ?? task.title;
                task.description = taskEditable.description ?? task.description;
                task.repeatKind = taskEditable.repeatKind ?? task.repeatKind;
                task.repeatTimes = taskEditable.repeatTimes ?? task.repeatTimes;
                task.importance = taskEditable.importance ?? task.importance;
                task.date = taskEditable.date ?? task.date;

                // TODO: If current iteration is last and completed and new repeatTimes is higher add new iteration
            }),

        toggle: (taskId: string) =>
            set((state) => {
                const task = state.taskSlice.tasks.find((task) => task.id === taskId);

                if (!task) {
                    throw new Error(`Task with id ${taskId} not found`);
                }

                task.completed = !task.completed;
                task.completedDate = task.completed ? new Date() : undefined;

                adjustUserBalance(state, priceToNumber(importanceToPrice(task.importance)) * (task.completed ? 1 : -1));

                if (task.dreamId) {
                    tryCompleteDream(state, task.dreamId);
                }

                // TODO: Process next task iteration if needed
            }),
    },
});

export function filterTasks(tasks: Task[], period: TaskPeriodEnum): Task[] {
    const now = new Date();
    let periodFilterFn: (task: Task) => boolean;

    switch (period) {
        case TaskPeriodEnum.Today:
            periodFilterFn = (task: Task) => {
                return (
                    now.getFullYear() === task.date?.getFullYear() &&
                    now.getMonth() === task.date?.getMonth() &&
                    now.getDate() === task.date?.getDate()
                );
            };
            break;
        case TaskPeriodEnum.Tomorrow:
            periodFilterFn = (task: Task) => {
                return (
                    now.getFullYear() === task.date?.getFullYear() &&
                    now.getMonth() === task.date?.getMonth() &&
                    now.getDate() + 1 === task.date?.getDate()
                );
            };
            break;
        case TaskPeriodEnum.Upcoming:
            periodFilterFn = (task: Task) => {
                return (
                    now.getFullYear() === task.date?.getFullYear() &&
                    now.getMonth() === task.date?.getMonth() &&
                    now.getDate() + 1 < task.date?.getDate()
                );
            };
            break;
        case TaskPeriodEnum.Someday:
            periodFilterFn = (task: Task) => !task.date;
            break;
        case TaskPeriodEnum.All:
            periodFilterFn = () => true;
            break;
    }

    return tasks.filter(periodFilterFn);
}

export function sortTasks(tasks: Task[]) {
    const taskImportanceArray = importanceToArray();

    return tasks
        .sort((a, b) => taskImportanceArray.indexOf(a.importance) - taskImportanceArray.indexOf(b.importance))
        .sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
}

export function getTasksLoad(tasks: Task[]): number {
    return tasks
        .map((task) => priceToNumber(importanceToPrice(task.importance)))
        .reduce((load, price) => load + price, 0);
}

function getNextTaskDate(date: Date, taskRepeatKind: TaskRepeatKindEnum): Date {
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

