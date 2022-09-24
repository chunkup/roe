import create from "zustand";
import deepMerge from "deepmerge";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDreamStoreSlice, DreamStoreSlice } from "./features/dream/store/dream-store";
import { createRewardStoreSlice, RewardStoreSlice } from "./features/reward/store/reward-store";
import { createTaskIterationStoreSlice, TaskIterationStoreSlice } from "./features/task/store/task-iteration-store";
import { createTaskStoreSlice, TaskStoreSlice } from "./features/task/store/task-store";
import { createUserStoreSlice, UserStoreSlice } from "./features/user/store/user-store";
import { storage } from "./storage";

export type Store = TaskStoreSlice & TaskIterationStoreSlice & DreamStoreSlice & RewardStoreSlice & UserStoreSlice;

export type Mutators = [["zustand/persist", unknown], ["zustand/immer", never]];

export const useStore = create<Store>()(
    persist(
        immer((...a) => ({
            ...createTaskStoreSlice(...a),
            ...createTaskIterationStoreSlice(...a),
            ...createDreamStoreSlice(...a),
            ...createRewardStoreSlice(...a),
            ...createUserStoreSlice(...a),
        })),
        {
            name: "store",
            getStorage: () => ({
                getItem: (key: string) => storage.get(key),
                setItem: (key: string, value: string) => storage.set(key, value),
                removeItem: (key: string) => storage.remove(key)
            }),
            merge: (oldState: any, newState: any) =>
                deepMerge(oldState, newState, { arrayMerge: (a, b) => a.length ? a : b }),
        }
    )
);

export async function setupStore() {
    await useStore.persist.rehydrate();
}

