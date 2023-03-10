import { nanoid } from "nanoid";
import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";
import { changeUserBalance } from "../../user/store/user.store";

export interface Reward {
    id: string;
    dreamId?: string;
    title: string;
    description?: string;
    price: number;
    completed: boolean;
    completionDate?: number;
}

export type RewardEditable = Omit<Reward, "id" | "completed">;

export interface RewardStoreSlice {
    rewardSlice: {
        rewards: Reward[];
        add: (RewardEditable: RewardEditable) => void;
        remove: (rewardId: string) => void;
        update: (rewardId: string, RewardEditable: RewardEditable) => void;
        toggle: (rewardId: string) => void;
    };
}

export const createRewardStoreSlice: StateCreator<Store, Mutators, [], RewardStoreSlice> = (set) => ({
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
                    completed: false,
                });
            }),

        remove: (rewardId) =>
            set((state) => {
                state.rewardSlice.rewards = state.rewardSlice.rewards.filter((reward) => reward.id !== rewardId);
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

        toggle: (rewardId) => {
            set((state) => {
                const reward = state.rewardSlice.rewards.find((reward) => reward.id === rewardId);

                if (!reward) {
                    throw new Error(`Reward with id ${rewardId} not found`);
                }

                if (!reward.completed && state.userSlice.balance < reward.price) {
                    return;
                }

                changeUserBalance(state, (reward.completed ? 1 : -1) * Number(reward.price));

                reward.completed = !reward.completed;
                reward.completionDate = reward.completed ? Date.now() : undefined;
            });
        },
    },
});

export function sortRewards(rewards: Reward[]) {
    return rewards.sort((a, b) => {
        const aCompleted = a.completed;
        const bCompleted = b.completed;

        return (aCompleted ? 1 : 0) - (bCompleted ? 1 : 0);
    });
}
