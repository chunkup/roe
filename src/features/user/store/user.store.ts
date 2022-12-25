import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";

export interface UserStoreSlice {
    userSlice: {
        balance: number;
        changeBalance: (amount: number) => void;
    };
}

export function changeUserBalance(state: Store, amount: number) {
    state.userSlice.balance = Number(state.userSlice.balance) + Number(amount);
}

export const createUserStoreSlice: StateCreator<Store, Mutators, [], UserStoreSlice> = (set) => ({
    userSlice: {
        balance: 0,

        changeBalance: (amount) => set((state) => changeUserBalance(state, amount)),
    },
});
