import {
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonRadio,
    IonRadioGroup,
    IonTextarea
} from "@ionic/react";
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
    const storeTaskIteration = useStore((state) =>state.taskIterationSlice.taskIterations.find((taskIteration) => taskIteration.id === params.taskIterationId));
    const storeAddTaskIteration = useStore((state) => state.taskIterationSlice.add);
    const storeUpdateTaskIteration = useStore((state) => state.taskIterationSlice.update);
    const storeRemoveTaskIteration = useStore((state) => state.taskIterationSlice.remove);
    const storeTask = useStore((state) => state.taskSlice.tasks.find((task) => task.id === storeTaskIteration?.taskId));
    const storeAddTask = useStore((state) => state.taskSlice.add);
    const storeUpdateTask = useStore((state) => state.taskSlice.update);
    const storeRemoveTask = useStore((state) => state.taskSlice.remove);

    const formMethods = useForm<FormInputs>({
        defaultValues: {
            title: storeTask?.title ?? "",
            description: storeTask?.description ?? "",
            importance: storeTaskIteration?.importance ?? TaskIterationImportanceEnum.Ordinary,
        },
    });

    const onSubmit = (data: FormInputs) => {
        if (storeTask && storeTaskIteration) {
            storeUpdateTask(storeTask.id, { title: data.title, description: data.description });
            storeUpdateTaskIteration(storeTaskIteration.id, { importance: data.importance });
        } else {
            const taskId = storeAddTask({ title: data.title, description: data.description });
            storeAddTaskIteration({ taskId, importance: data.importance });
        }

        history.push("/tabs/tasks");
    };

    const onRemove = () => {
        if (storeTask && storeTaskIteration) {
            storeRemoveTaskIteration(storeTaskIteration.id);
            storeRemoveTask(storeTask.id);
        }

        history.push("/tabs/tasks");
    }

    return (
        <EditScreen
            id="edit-task"
            title="Task Edit"
            form={<Form formMethods={formMethods} />}
            fabSaveOnClick={formMethods.handleSubmit(onSubmit)}
            fabRemoveOnClick={onRemove}
        />
    );
};

export default TaskEditScreen;
