import { IonCheckbox, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { starOutline } from "ionicons/icons";

import { HomeScreen } from "../../components/HomeScreen";
import { useStore } from "../../store";
import { importanceToColor } from "./store/task-importance.enum";
import { filterTasks, sortTasks, Task } from "./store/task.store";

import "../../theme/checkbox.css";

const TaskItem = ({ task }: { task: Task }) => {
    const toggleTask = useStore((state) => state.taskSlice.toggle);

    if (!task) {
        return null;
    }

    return (
        <IonItem routerLink={"/tasks/" + task.id}>
            <IonCheckbox
                slot="start"
                checked={task.completed}
                onClick={(e) => e.stopPropagation()}
                onIonChange={() => toggleTask(task.id)}
                color={importanceToColor(task.importance)}
                className={importanceToColor(task.importance)}
            ></IonCheckbox>

            <IonLabel>
                {task.title}
                {task.description && <p>{task.description}</p>}
            </IonLabel>

            {task.dreamId && <IonIcon icon={starOutline} slot="end" />}
        </IonItem>
    );
};

const TasksList = () => {
    const period = useStore((state) => state.taskSlice.taskPeriod);
    const tasks = useStore((state) => state.taskSlice.tasks);
    const filteredSortedTasks = sortTasks(filterTasks(tasks, period));

    return (
        <IonList>
            {filteredSortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </IonList>
    );
};

export const TasksScreen: React.FC = () => {
    const taskPeriod = useStore((state) => state.taskSlice.taskPeriod);

    return <HomeScreen id="tasks-screen" title={"Tasks \\ " + taskPeriod} list={<TasksList />} fabRouterLink="/tasks/add" />;
};
