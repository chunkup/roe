import { StateCreator } from 'zustand'
import { Mutators, Store } from "../../../store";
import { nanoid } from 'nanoid'
import { TaskRepeatKindEnum } from './task-repeat-kind-enum'
import { TaskIterationEditable } from './task-iteration-store'

export interface Task {
    id: string
    dreamId?: string
    title: string
    description?: string
    repeatKind: TaskRepeatKindEnum
    repeatTimes: number
    completedTimes: number
    completed: boolean
}

export type TaskEditable = Pick<Task, 'dreamId' | 'title' | 'description'> & Partial<Pick<Task, 'repeatKind' | 'repeatTimes'>>

export interface TaskStoreSlice {
    taskSlice: {
        tasks: Task[]
        add: (taskEditable: TaskEditable, taskIterationEditable: Omit<TaskIterationEditable, "taskId">) => void
        remove: (taskId: string) => void
        update: (taskId: string, taskEditable: TaskEditable) => void
    }
}

export const createTaskStoreSlice: StateCreator<Store, Mutators, [], TaskStoreSlice> = (
    set,
    get
) => ({
    taskSlice: {
        tasks: [],

        add: (taskEditable, taskIterationEditable) => {
            const taskId = nanoid()

            set((state) => {
                state.taskSlice.tasks.push({
                    id: taskId,
                    dreamId: taskEditable.dreamId,
                    title: taskEditable.title,
                    description: taskEditable.description,
                    repeatKind: taskEditable.repeatKind ?? TaskRepeatKindEnum.None,
                    repeatTimes: taskEditable.repeatTimes ?? 1,
                    completedTimes: 0,
                    completed: false
                })
            })

            get().taskIterationSlice.add({
                taskId: taskId,
                date: taskIterationEditable.date,
                importance: taskIterationEditable.importance,
            })
        },

        remove: (taskId) =>
            set((state) => {
                state.taskSlice.tasks = state.taskSlice.tasks.filter((task) => task.id !== taskId)
            }),

        update: (taskId, taskEditable) =>
            set((state) => {
                const task = state.taskSlice.tasks.find((task) => task.id === taskId)

                if (!task) {
                    throw new Error(`Task with id ${taskId} not found`)
                }

                task.title = taskEditable.title ?? task.title
                task.description = taskEditable.description ?? task.description
                task.repeatKind = taskEditable.repeatKind ?? task.repeatKind
                task.repeatTimes = taskEditable.repeatTimes ?? task.repeatTimes
            })
    },
})
