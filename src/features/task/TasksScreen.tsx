import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/react";
import HomeScreen from "../../components/HomeScreen";
import { useStore } from "../../store";
import { importanceToColor, TaskIterationImportanceEnum } from "./store/task-iteration-importance-enum";

import "../../theme/checkbox.css";

const TaskIterationsList = () => {
    const tasks = useStore((state) => state.taskSlice.tasks);
    const taskIterations = useStore((state) => state.taskIterationSlice.taskIterations);
    const toggleTaskIteration = useStore((state) => state.taskIterationSlice.toggle);

    return (
        <IonList>
            {taskIterations.map((taskIteration, index) => (
                <IonItem key={taskIteration.id}>
                    <IonCheckbox
                        slot="start"
                        checked={taskIteration.completed}
                        onClick={() => toggleTaskIteration(taskIteration.id)}
                        color={importanceToColor(taskIteration.importance)}
                        className={importanceToColor(taskIteration.importance)}
                    ></IonCheckbox>
                    <IonLabel>
                        {tasks.find((task) => task.id === taskIteration.taskId)?.title} {index}
                    </IonLabel>
                </IonItem>
            ))}
        </IonList>
    );
};

const TasksScreen: React.FC = () => {
    const addTask = useStore((state) => state.taskSlice.add);

    const fabOnClick = () => {
        addTask(
            {
                title: "Buy a milk",
            },
            {
                importance: TaskIterationImportanceEnum.Ordinary,
            }
        );
    };

    return <HomeScreen id="tasks-screen" title="Tasks" list={<TaskIterationsList />} fabOnClick={fabOnClick} />;
};

export default TasksScreen;
