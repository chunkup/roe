import { IonCheckbox, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { starOutline } from "ionicons/icons";

import { importanceToColor } from "./store/task-importance.enum";
import HomeScreen from "../../components/HomeScreen";
import { useStore } from "../../store";
import { Task } from "./store/task.store";

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
    const tasks = useStore((state) => state.taskSlice.tasks);

    return (
        <IonList>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </IonList>
    );
};

const TasksScreen: React.FC = () => {
    return <HomeScreen id="tasks-screen" title="Tasks" list={<TasksList />} fabRouterLink="/tasks/add" />;
};

export default TasksScreen;
