import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { StateCreator } from "zustand";

import { Mutators, Store } from "../../../store";
import { tryCompleteDream } from "../../dream/store/dream.store";
import { changeUserBalance } from "../../user/store/user.store";
import { importanceToArray, TaskImportanceEnum } from "./task-importance.enum";
import { TaskPeriodEnum } from "./task-period.enum";
import { importanceToPrice, priceToNumber } from "./task-price.enum";
import { TaskRepeatKindEnum } from "./task-repeat-kind.enum";

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
    date?: number;
    time?: number;
    completedDate?: number;
}

export type TaskEditable = Omit<Task, "id" | "completed">;

export interface TaskStoreSlice {
    taskSlice: {
        tasks: Task[];
        taskPeriod: TaskPeriodEnum;
        setTaskPeriod: (taskPeriod: TaskPeriodEnum) => void;
        add: (taskEditable: TaskEditable) => void;
        remove: (taskId: string) => void;
        update: (taskId: string, taskEditable: TaskEditable) => void;
        toggle: (taskId: string) => void;
    };
}

function addIteration(state: Store, task: Task, index: number): void {
    // TODO: Process next date setting
    addTask(state, {
        ...task,
        index,
    });

    task.dreamId = undefined;
    task.repeatKind = TaskRepeatKindEnum.None;
    task.repeatTimes = 1;
    task.index = 0;
}

function addTask(state: Store, taskEditable: TaskEditable): void {
    const taskId = nanoid();

    state.taskSlice.tasks.push({
        id: taskId,
        index: taskEditable.index ?? 0,
        dreamId: taskEditable.dreamId,
        title: taskEditable.title,
        description: taskEditable.description,
        importance: taskEditable.importance ?? TaskImportanceEnum.Ordinary,
        repeatKind: taskEditable.repeatKind ?? TaskRepeatKindEnum.None,
        repeatTimes: taskEditable.repeatTimes ?? 1,
        date: taskEditable.date,
        time: taskEditable.time,
        completed: false,
    });
}

export const createTaskStoreSlice: StateCreator<Store, Mutators, [], TaskStoreSlice> = (set) => ({
    taskSlice: {
        tasks: [],

        taskPeriod: TaskPeriodEnum.Today,

        setTaskPeriod: (taskPeriod: TaskPeriodEnum) => {
            set((state) => {
                state.taskSlice.taskPeriod = taskPeriod;
            });
        },

        add: (taskEditable) => {
            set((state) => {
                addTask(state, taskEditable);
            });
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

                task.index = taskEditable.repeatKind === TaskRepeatKindEnum.None ? 0 : task.index;
                task.title = taskEditable.title ?? task.title;
                task.description = taskEditable.description ?? task.description;
                task.repeatKind = taskEditable.repeatKind ?? task.repeatKind;
                task.repeatTimes = taskEditable.repeatKind === TaskRepeatKindEnum.None ? 1 : taskEditable.repeatTimes ?? task.repeatTimes;
                task.importance = taskEditable.importance ?? task.importance;
                task.date = taskEditable.date ?? task.date;
                task.time = taskEditable.time ?? task.time;

                if (task.completed && taskEditable.repeatTimes && taskEditable.repeatTimes > task.repeatTimes) {
                    addIteration(state, task, taskEditable.repeatTimes);
                }
            }),

        toggle: (taskId: string) =>
            set((state) => {
                const task = state.taskSlice.tasks.find((task) => task.id === taskId);

                if (!task) {
                    throw new Error(`Task with id ${taskId} not found`);
                }

                task.completed = !task.completed;
                task.completedDate = task.completed ? Date.now() : undefined;

                changeUserBalance(state, priceToNumber(importanceToPrice(task.importance)) * (task.completed ? 1 : -1));

                if (task.dreamId) {
                    tryCompleteDream(state, task.dreamId);
                }

                if (task.completed && task.repeatTimes > task.index + 1) {
                    addIteration(state, task, task.index + 1);
                }
            }),
    },
});

/**
 * Filter tasks by period
 * @param tasks tasks array
 * @param period period enum value
 * @returns filtered tasks array
 */
export function filterTasks(tasks: Task[], period: TaskPeriodEnum): Task[] {
    const now = new Date();
    let periodFilterFn: (task: Task) => boolean;

    switch (period) {
        case TaskPeriodEnum.Today:
            periodFilterFn = (task: Task) => !!(task.date && dayjs(now).diff(task.date, "day") === 0);
            break;
        case TaskPeriodEnum.Tomorrow:
            periodFilterFn = (task: Task) => !!(task.date && dayjs(now).diff(task.date, "day") === -1);
            break;
        case TaskPeriodEnum.Upcoming:
            periodFilterFn = (task: Task) => !!(task.date && dayjs(now).diff(task.date, "day") < -1);
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

/**
 * Sort tasks by importance and completed state
 * @param tasks tasks array
 * @returns sorted tasks array
 */
export function sortTasks(tasks: Task[]) {
    const taskImportanceArray = importanceToArray();

    return tasks
        .sort((a, b) => taskImportanceArray.indexOf(a.importance) - taskImportanceArray.indexOf(b.importance))
        .sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
}

export function getTasksLoad(tasks: Task[]): number {
    return tasks.map((task) => priceToNumber(importanceToPrice(task.importance))).reduce((load, price) => load + price, 0);
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
