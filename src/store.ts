import create from "zustand";
import deepMerge from "deepmerge";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDreamStoreSlice, DreamStoreSlice } from "./features/dream/store/dream.store";
import { createRewardStoreSlice, RewardStoreSlice } from "./features/reward/store/reward.store";
import { createTaskStoreSlice, TaskStoreSlice } from "./features/task/store/task.store";
import { createUserStoreSlice, UserStoreSlice } from "./features/user/store/user.store";
import { IonicStorage } from "./storage";

export type Store = TaskStoreSlice & DreamStoreSlice & RewardStoreSlice & UserStoreSlice;

export type Mutators = [["zustand/persist", unknown], ["zustand/immer", never]];

export const useStore = create<Store>()(
    persist(
        immer((...a) => ({
            ...createTaskStoreSlice(...a),
            ...createDreamStoreSlice(...a),
            ...createRewardStoreSlice(...a),
            ...createUserStoreSlice(...a),
        })),
        {
            name: "store",
            getStorage: () => IonicStorage,
            merge: (oldState: any, newState: any) => deepMerge(newState, oldState, { arrayMerge: (a, b) => b }),
        }
    )
);

export async function setupStore() {
    await useStore.persist.rehydrate();
}
