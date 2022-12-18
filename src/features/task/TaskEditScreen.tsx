import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonRadio, IonRadioGroup, IonTextarea } from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

import { TaskIterationImportanceEnum } from "./store/task-iteration-importance-enum";
import EditScreen from "../../components/EditScreen";
import { useStore } from "../../store";

import "../../theme/radio.css";

type FormInputs = {
    title: string;
    description: string;
    importance: TaskIterationImportanceEnum;
};

const Form: React.FC<{ formMethods: UseFormReturn<FormInputs, any> }> = ({ formMethods }) => {
    const ionInvalidClass = (name: keyof FormInputs) =>
        formMethods.formState.isSubmitted && formMethods.getFieldState(name).error ? "ion-invalid" : "";

    return (
        <FormProvider {...formMethods}>
            <IonList>
                <IonListHeader>
                    <IonLabel>Title</IonLabel>
                </IonListHeader>

                <IonItem className={ionInvalidClass("title")}>
                    <IonInput {...formMethods.register("title", { required: true })} />
                    <IonNote slot="error" color="danger">
                        Required
                    </IonNote>
                </IonItem>

                <IonListHeader>
                    <IonLabel>Description</IonLabel>
                </IonListHeader>

                <IonItem>
                    <IonTextarea {...formMethods.register("description")} />
                </IonItem>
            </IonList>

            <IonList className={ionInvalidClass("importance")}>
                <IonRadioGroup
                    {...formMethods.register("importance", { required: true })}
                    value={formMethods.getValues("importance")}
                    onIonChange={(e) => formMethods.setValue("importance", e.detail.value)}
                >
                    <IonListHeader>
                        <IonLabel>Importance</IonLabel>
                    </IonListHeader>

                    <IonItem>
                        <IonLabel>High</IonLabel>
                        <IonRadio value={TaskIterationImportanceEnum.High} color="danger" slot="start" />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Medium</IonLabel>
                        <IonRadio value={TaskIterationImportanceEnum.Medium} color="warning" slot="start" />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Ordinary</IonLabel>
                        <IonRadio value={TaskIterationImportanceEnum.Ordinary} color="primary" slot="start" />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Low</IonLabel>
                        <IonRadio value={TaskIterationImportanceEnum.Low} color="medium" slot="start" />
                    </IonItem>
                </IonRadioGroup>
            </IonList>
        </FormProvider>
    );
};

const TaskEditScreen: React.FC = () => {
    const params = useParams<{ taskIterationId: string }>();
    const history = useHistory();
    const taskIteration = useStore((state) =>
        state.taskIterationSlice.taskIterations.find((taskIteration) => taskIteration.id === params.taskIterationId)
    );
    const addTaskIteration = useStore((state) => state.taskIterationSlice.add);
    const updateTaskIteration = useStore((state) => state.taskIterationSlice.update);
    const removeTaskIteration = useStore((state) => state.taskIterationSlice.remove);
    const task = useStore((state) => state.taskSlice.tasks.find((task) => task.id === taskIteration?.taskId));
    const addTask = useStore((state) => state.taskSlice.add);
    const updateTask = useStore((state) => state.taskSlice.update);
    const removeTask = useStore((state) => state.taskSlice.remove);

    const formMethods = useForm<FormInputs>({
        defaultValues: {
            title: task?.title ?? "",
            description: task?.description ?? "",
            importance: taskIteration?.importance ?? TaskIterationImportanceEnum.Ordinary,
        },
    });

    const onSubmit = (data: FormInputs) => {
        if (task && taskIteration) {
            updateTask(task.id, { title: data.title, description: data.description });
            updateTaskIteration(taskIteration.id, { importance: data.importance });
        } else {
            const taskId = addTask({ title: data.title, description: data.description });
            addTaskIteration({ taskId, importance: data.importance });
        }

        history.push("/tabs/tasks");
    };

    const onRemove = () => {
        if (task && taskIteration) {
            // TODO: Think about removing completed tasks
            removeTaskIteration(taskIteration.id);
            removeTask(task.id);
        }

        history.push("/tabs/tasks");
    };

    return (
        <EditScreen
            id="edit-task"
            title="Task Edit"
            form={<Form formMethods={formMethods} />}
            fabSaveOnClick={formMethods.handleSubmit(onSubmit)}
            fabRemoveOnClick={task && onRemove}
        />
    );
};

export default TaskEditScreen;
