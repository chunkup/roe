import { Draft } from "immer";
import { nanoid } from "nanoid";
import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";
import { importanceToPrice } from "../../task/store/task-price.enum";

export interface Dream {
    id: string;
    title: string;
    description?: string | null;
    completed: boolean;
    completionPercent: number;
    completionDate?: number;
}

export type DreamEditable = Omit<Dream, "id" | "completed" | "completionPercent">;

export interface DreamStoreSlice {
    dreamSlice: {
        dreams: Dream[];
        add: (dreamEditable: DreamEditable) => void;
        remove: (dreamId: string) => void;
        update: (dreamId: string, dreamEditable: DreamEditable) => void;
        tryComplete: (dreamId: string) => void;
    };
}

export function tryCompleteDream(state: Draft<Store>, dreamId: string): void {
    const dream = state.dreamSlice.dreams.find((dream) => dream.id === dreamId);

    if (!dream) {
        throw new Error(`Dream with id ${dreamId} not found`);
    }

    const tasks = state.taskSlice.tasks.filter((task) => task.dreamId === dreamId);
    const completed = tasks.every((task) => task.completed);

    let completedTasksWeight = 0;
    let tasksWeight = 0;
    tasks.forEach((task) => {
        tasksWeight += importanceToPrice(task.importance);

        if (task.completed) {
            completedTasksWeight += importanceToPrice(task.importance);
        }
    });

    dream.completionPercent = Math.floor((completedTasksWeight / tasksWeight) * 100);

    if (dream.completed === completed) {
        return;
    }

    dream.completed = completed;
    dream.completionDate = completed ? Date.now() : undefined;

    state.rewardSlice.rewards.filter((reward) => reward.dreamId === dreamId).forEach((reward) => (reward.completed = completed));
}

export const createDreamStoreSlice: StateCreator<Store, Mutators, [], DreamStoreSlice> = (set) => ({
    dreamSlice: {
        dreams: [],

        add: (dreamEditable) =>
            set((state) => {
                state.dreamSlice.dreams.push({
                    id: nanoid(),
                    title: dreamEditable.title,
                    description: dreamEditable.description,
                    completed: true,
                    completionPercent: 0,
                });
            }),

        remove: (dreamId) =>
            set((state) => {
                state.dreamSlice.dreams = state.dreamSlice.dreams.filter((dream) => dream.id !== dreamId);
            }),

        update: (dreamId, dreamEditable) =>
            set((state) => {
                const dream = state.dreamSlice.dreams.find((dream) => dream.id === dreamId);

                if (!dream) {
                    throw new Error(`Dream with id ${dreamId} not found`);
                }

                dream.title = dreamEditable.title;
                dream.description = dreamEditable.description;
            }),

        tryComplete: (dreamId) => set((state) => tryCompleteDream(state, dreamId)),
    },
});

export function sortDreams(dreams: Dream[]): Dream[] {
    return dreams.sort((a, b) => {
        const aCompleted = a.completed;
        const bCompleted = b.completed;

        return (aCompleted ? 1 : 0) - (bCompleted ? 1 : 0);
    });
}
