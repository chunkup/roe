import { StateCreator } from "zustand";
import { nanoid } from "nanoid";

import { TaskRepeatKindEnum } from "./task-repeat-kind-enum";
import { Mutators, Store } from "../../../store";

export interface Task {
    id: string;
    dreamId?: string;
    title: string;
    description?: string;
    repeatKind: TaskRepeatKindEnum;
    repeatTimes: number;
    completedTimes: number;
    completed: boolean;
}

export type TaskAdd = Pick<Task, "title"> & Partial<Pick<Task, "dreamId" | "description" | "repeatKind" | "repeatTimes">>;
export type TaskUpdate = Partial<Pick<Task, "title" | "description" | "repeatKind" | "repeatTimes">>;

export interface TaskStoreSlice {
    taskSlice: {
        tasks: Task[];
        add: (taskEditable: TaskAdd) => string;
        remove: (taskId: string) => void;
        update: (taskId: string, taskEditable: TaskUpdate) => void;
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
                    dreamId: taskEditable.dreamId,
                    title: taskEditable.title,
                    description: taskEditable.description,
                    repeatKind: taskEditable.repeatKind ?? TaskRepeatKindEnum.None,
                    repeatTimes: taskEditable.repeatTimes ?? 1,
                    completedTimes: 0,
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
            }),
    },
});
