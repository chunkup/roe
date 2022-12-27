import { useEffect } from "react";
import { useStore } from "../../../store";

/**
 * Custom hook that removes all dreams that have no title and no tasks and no rewards.
 */
export function useRemoveEmptyDreams() {
    const dreamRemove = useStore((state) => state.dreamSlice.remove);
    const emptyDreams = useStore((state) =>
        state.dreamSlice.dreams.filter(
            (dream) =>
                dream.title === "" &&
                !state.taskSlice.tasks.some((task) => task.dreamId === dream.id) &&
                !state.rewardSlice.rewards.some((reward) => reward.dreamId === dream.id)
        )
    );

    useEffect(() => {
        emptyDreams.forEach((dream) => dreamRemove(dream.id));
    }, [emptyDreams, dreamRemove]);
}
