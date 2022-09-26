import { IonCheckbox, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { starOutline } from "ionicons/icons";

import { importanceToColor } from "./store/task-iteration-importance-enum";
import { TaskIteration } from "./store/task-iteration-store";
import HomeScreen from "../../components/HomeScreen";
import { useStore } from "../../store";

import "../../theme/checkbox.css";

const TaskIterationItem = ({ taskIteration }: { taskIteration: TaskIteration }) => {
    const toggleTaskIteration = useStore((state) => state.taskIterationSlice.toggle);
    const task = useStore((state) => state.taskSlice.tasks.find((task) => task.id === taskIteration.taskId));

    if (!task) {
        return null;
    }

    return (
        <IonItem routerLink={"../edit-task/" + taskIteration.id}>
            <IonCheckbox
                slot="start"
                checked={taskIteration.completed}
                onClick={() => toggleTaskIteration(taskIteration.id)}
                color={importanceToColor(taskIteration.importance)}
                className={importanceToColor(taskIteration.importance)}
            ></IonCheckbox>

            <IonLabel>
                {task.title}
                {task.description && <p>{task.description}</p>}
            </IonLabel>

            {task.dreamId && <IonIcon icon={starOutline} slot="end" />}
        </IonItem>
    );
};

const TaskIterationsList = () => {
    const taskIterations = useStore((state) => state.taskIterationSlice.taskIterations);

    return (
        <IonList>
            {taskIterations.map((taskIteration) => (
                <TaskIterationItem key={taskIteration.id} taskIteration={taskIteration} />
            ))}
        </IonList>
    );
};

const TasksScreen: React.FC = () => {
    return <HomeScreen id="tasks-screen" title="Tasks" list={<TaskIterationsList />} fabRouterLink="../add-task" />;
};

export default TasksScreen;
