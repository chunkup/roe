import { StateCreator } from "zustand";
import { Mutators, Store } from "../../../store";

export interface UserStoreSlice {
    userSlice: {
        balance: number;
        adjustBalance: (amount: number) => void;
    };
}

export const createUserStoreSlice: StateCreator<Store, Mutators, [], UserStoreSlice> = (
    set,
) => ({
    userSlice: {
        balance: 0,

        adjustBalance: (amount) =>
            set(state => {
                state.userSlice.balance += amount;
            })
    },
});
