import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";
import { nanoid } from "nanoid";
import { Draft } from "immer";

export interface Dream {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
}

export type DreamEditable = Pick<Dream, "title" | "description">;

export interface DreamStoreSlice {
    dreamSlice: {
        dreams: Dream[];
        add: (dreamEditable: DreamEditable) => void;
        remove: (dreamId: string) => void;
        update: (dreamId: string, dreamEditable: DreamEditable) => void;
        tryCompleteDream: (dreamId: string) => void;
    };
}

export function tryCompleteDream(state: Draft<Store>, dreamId: string): void {
    const dream = state.dreamSlice.dreams.find((dream) => dream.id === dreamId);

    if (!dream) {
        throw new Error(`Dream with id ${dreamId} not found`);
    }

    const tasks = state.taskSlice.tasks.filter((task) => task.dreamId === dreamId);
    const rewards = state.rewardSlice.rewards.filter((reward) => reward.dreamId === dreamId);
    const completed = tasks.every((task) => task.completed);

    if (dream.completed === completed) {
        return;
    }

    dream.completed = completed;
    rewards.forEach((reward) => state.rewardSlice.toggle(reward.id, completed));
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
                    completed: false,
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

        tryCompleteDream: (dreamId) => set((state) => tryCompleteDream(state, dreamId)),
    },
});

export function sortDreams(dreams: Dream[]): Dream[] {
    return dreams.sort((a, b) => {
        const aCompleted = a.completed;
        const bCompleted = b.completed;

        return (aCompleted ? 1 : 0) - (bCompleted ? 1 : 0);
    });
}

// TODO: Finish
// export function useDreamCompletionPercent(dream: Dream) {
//   const dream = get().dreamSlice.dreams.find(d => d.id === dreamId);

//       if (!dream) {
//         throw new Error(`Dream with id ${dreamId} not found`);
//       }

//       const tasks = get().taskSlice.tasks.filter(task => task.dreamId === dream.id);

//       let price = 0;
//       let completedPrice = 0;

//       tasks.forEach(task => {
//         const iterations = get().taskIterationSlice.taskIterations.filter(iteration => iteration.taskId === task.id);

//         iterations.forEach(iteration => {
//           price += taskIterationImportanceEnumToPrice(iteration.importance);

//           if (iteration.completed) {
//             completedPrice += taskIterationImportanceEnumToPrice(iteration.importance);
//           }
//         })
//       });

//       return completedPrice / price * 100;
// }
