import { IonItem, IonLabel, IonList } from '@ionic/react';
import HomeScreen from '../../components/HomeScreen';
import { useStore } from '../../store';
import { TaskIterationImportanceEnum } from './store/task-iteration-importance-enum';

const TaskList = () => {
    const tasks = useStore((state) => state.taskSlice.tasks);

    return (
        <IonList>
            { tasks.map((task, index) => <IonItem key={task.id}><IonLabel>{task.title} {index}</IonLabel></IonItem>) }
        </IonList>
    )
};

const TasksScreen: React.FC = () => {
    const addTask = useStore((state) => state.taskSlice.add);

    const fabOnClick = () => {
        addTask(
            {
                title: "Buy a milk",
            },
            {
                importance: TaskIterationImportanceEnum.Ordinary
            }
        );
    }

    return (
        <HomeScreen id="tasks-screen" title="Tasks" list={<TaskList />} fabClick={fabOnClick} />
    );
};

export default TasksScreen;
