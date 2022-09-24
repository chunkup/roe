import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";
import { nanoid } from "nanoid";

export interface Reward {
    id: string;
    dreamId?: string;
    title: string;
    description?: string;
    price: number;
    bought: boolean;
}

export type RewardEditable = Pick<Reward, "title" | "price"> & Partial<Pick<Reward, "dreamId" | "description">>;

export interface RewardStoreSlice {
    rewardSlice: {
        rewards: Reward[];
        add: (RewardEditable: RewardEditable) => void;
        remove: (rewardId: string) => void;
        update: (rewardId: string, RewardEditable: RewardEditable) => void;
        toggle: (rewardId: string, state?: boolean) => void;
    };
}

export const createRewardStoreSlice: StateCreator<Store, Mutators, [], RewardStoreSlice> = (
    set,
) => ({
    rewardSlice: {
        rewards: [],

        add: (rewardEditable) =>
            set((state) => {
                state.rewardSlice.rewards.push({
                    id: nanoid(),
                    dreamId: rewardEditable.dreamId,
                    title: rewardEditable.title,
                    description: rewardEditable.description,
                    price: rewardEditable.dreamId ? 0 : rewardEditable.price,
                    bought: false,
                });
            }),

        remove: (rewardId) =>
            set((state) => {
                state.rewardSlice.rewards = state.rewardSlice.rewards.filter(
                    (reward) => reward.id !== rewardId,
                );
            }),

        update: (rewardId, rewardEditable) =>
            set((state) => {
                const reward = state.rewardSlice.rewards.find((reward) => reward.id === rewardId);

                if (!reward) {
                    throw new Error(`Reward with id ${rewardId} not found`);
                }

                reward.title = rewardEditable.title;
                reward.description = rewardEditable.description;
                reward.price = rewardEditable.price;
            }),

        toggle: (rewardId, bought) =>
            set((state) => {
                const reward = state.rewardSlice.rewards.find((reward) => reward.id === rewardId);

                if (!reward) {
                    throw new Error(`Reward with id ${rewardId} not found`);
                }

                if (reward.dreamId && bought == null) {
                    return;
                }

                reward.bought = bought ?? !reward.bought;
            }),
    },
});

export function sortRewards(rewards: Reward[]) {
    return rewards.sort((a, b) => {
        const aCompleted = a.bought;
        const bCompleted = b.bought;

        return (aCompleted ? 1 : 0) - (bCompleted ? 1 : 0);
    });
}
