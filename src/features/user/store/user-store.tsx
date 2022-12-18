import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";

export interface UserStoreSlice {
    userSlice: {
        balance: number;
        adjustBalance: (amount: number) => void;
    };
}

export function adjustUserBalance(state: Store, amount: number) {
    state.userSlice.balance = Number(state.userSlice.balance) + Number(amount);
}

export const createUserStoreSlice: StateCreator<Store, Mutators, [], UserStoreSlice> = (set) => ({
    userSlice: {
        balance: 0,

        adjustBalance: (amount) => set((state) => adjustUserBalance(state, amount)),
    },
});
