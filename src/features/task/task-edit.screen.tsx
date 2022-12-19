import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonRadio, IonRadioGroup, IonTextarea } from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { Controller, FormProvider, useForm, UseFormReturn } from "react-hook-form";

import { TaskIterationImportanceEnum } from "./store/task-iteration-importance.enum";
import EditScreen from "../../components/EditScreen";
import { useStore } from "../../store";

import "../../theme/radio.css";

// TODO: Improve date handling, processing MIN/MAX dates, etc

type FormInputs = {
    title: string;
    description: string;
    importance: TaskIterationImportanceEnum;
    date: string;
    time: string;
};

const Form: React.FC<{ formMethods: UseFormReturn<FormInputs, any> }> = ({ formMethods }) => {
    const ionInvalidClass = (name: keyof FormInputs) =>
        formMethods.formState.isSubmitted && formMethods.getFieldState(name).error ? "ion-invalid" : "";
    const dateValue = formMethods.watch("date");

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
                        <IonRadio value={TaskIterationImportanceEnum.High} className="ion-margin-end" color="danger" />
                        <IonLabel>High</IonLabel>

                        <IonRadio value={TaskIterationImportanceEnum.Medium} className="ion-margin-end" color="warning" />
                        <IonLabel>Medium</IonLabel>

                        <IonRadio value={TaskIterationImportanceEnum.Ordinary} className="ion-margin-end" color="primary" />
                        <IonLabel>Ordinary</IonLabel>

                        <IonRadio value={TaskIterationImportanceEnum.Low} className="ion-margin-end" color="medium" />
                        <IonLabel>Low</IonLabel>
                    </IonItem>
                </IonRadioGroup>
            </IonList>

            <IonList>
                <IonListHeader>
                    <IonLabel>Notification</IonLabel>
                </IonListHeader>

                <IonItem>
                    <IonLabel>Date</IonLabel>
                    <Controller
                        control={formMethods.control}
                        name="date"
                        render={({ field: { onChange, onBlur, value, name } }) => (
                            <IonInput name={name} value={value} onIonChange={onChange} type="date" clearInput={true} />
                        )}
                    />
                </IonItem>

                {dateValue && (
                    <IonItem>
                        <IonLabel>Time</IonLabel>
                        <IonInput {...formMethods.register("time")} type="time" clearInput={true} />
                    </IonItem>
                )}
            </IonList>
        </FormProvider>
    );
};

const TaskEditScreen: React.FC = () => {
    const params = useParams<{ taskIterationId: string }>();
    const history = useHistory();
    const taskIteration = useStore((state) =>
        state.taskIterationSlice.taskIterations.find((iteration) => iteration.id === params.taskIterationId)
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
            date: taskIteration?.date
                ? taskIteration.date.getDay() + "-" + taskIteration.date.getMonth() + "-" + taskIteration.date.getFullYear()
                : undefined,
            time: taskIteration?.date ? taskIteration.date.getHours() + ":" + taskIteration.date.getMinutes() : undefined,
        },
    });

    const onSubmit = (data: FormInputs) => {
        const date = data.date ? new Date(data.date + " " + (data.time ?? "")) : undefined;

        if (task && taskIteration) {
            updateTask(task.id, { title: data.title, description: data.description });
            updateTaskIteration(taskIteration.id, { importance: data.importance, date });
        } else {
            const taskId = addTask({ title: data.title, description: data.description });
            addTaskIteration({ taskId, importance: data.importance, date });
        }

        history.push("/tabs/tasks");
    };

    const onRemove = () => {
        if (task && taskIteration) {
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
            fabRemoveOnClick={task?.completedTimes === 0 ? onRemove : undefined}
        />
    );
};

export default TaskEditScreen;
