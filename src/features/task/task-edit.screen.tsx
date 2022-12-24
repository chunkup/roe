import {
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonRadio,
    IonRadioGroup,
    IonSelect,
    IonSelectOption,
    IonTextarea,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { Controller, FormProvider, useForm, UseFormReturn } from "react-hook-form";

import { TaskImportanceEnum } from "./store/task-importance.enum";
import EditScreen from "../../components/EditScreen";
import { useStore } from "../../store";

import "../../theme/radio.css";
import { TaskRepeatKindEnum } from "./store/task-repeat-kind.enum";

// TODO: Improve date handling, processing MIN/MAX dates, etc

type FormInputs = {
    title: string;
    description: string;
    importance: TaskImportanceEnum;
    date: string;
    time: string;
    repeatKind: TaskRepeatKindEnum;
    repeatTimes: number;
};

const Form: React.FC<{ form: UseFormReturn<FormInputs, any>; minRepeatTimes: number }> = ({ form, minRepeatTimes }) => {
    const ionInvalidClass = (name: keyof FormInputs) => (form.formState.isSubmitted && form.getFieldState(name).error ? "ion-invalid" : "");
    const dateValue = form.watch("date");

    return (
        <FormProvider {...form}>
            <IonList>
                <IonListHeader>
                    <IonLabel>Title</IonLabel>
                </IonListHeader>

                <IonItem className={ionInvalidClass("title")}>
                    <IonInput {...form.register("title", { required: true })} />
                    <IonNote slot="error" color="danger">
                        Required
                    </IonNote>
                </IonItem>

                <IonListHeader>
                    <IonLabel>Description</IonLabel>
                </IonListHeader>

                <IonItem>
                    <IonTextarea {...form.register("description")} />
                </IonItem>
            </IonList>

            <IonList className={ionInvalidClass("importance")}>
                <IonRadioGroup
                    {...form.register("importance", { required: true })}
                    value={form.getValues("importance")}
                    onIonChange={(e) => form.setValue("importance", e.detail.value)}
                >
                    <IonListHeader>
                        <IonLabel>Importance</IonLabel>
                    </IonListHeader>

                    <IonItem>
                        <IonRadio value={TaskImportanceEnum.High} className="ion-margin-end" color="danger" />
                        <IonLabel>High</IonLabel>

                        <IonRadio value={TaskImportanceEnum.Medium} className="ion-margin-end" color="warning" />
                        <IonLabel>Medium</IonLabel>

                        <IonRadio value={TaskImportanceEnum.Ordinary} className="ion-margin-end" color="primary" />
                        <IonLabel>Ordinary</IonLabel>

                        <IonRadio value={TaskImportanceEnum.Low} className="ion-margin-end" color="medium" />
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
                        control={form.control}
                        name="date"
                        render={({ field: { onChange, value, name } }) => (
                            <IonInput name={name} value={value} onIonChange={onChange} type="date" clearInput={true} />
                        )}
                    />
                </IonItem>

                {dateValue && (
                    <IonItem>
                        <IonLabel>Time</IonLabel>
                        <IonInput {...form.register("time")} type="time" clearInput={true} />
                    </IonItem>
                )}

                <IonListHeader>
                    <IonLabel>Repeat</IonLabel>
                </IonListHeader>

                <IonItem>
                    <IonLabel>Kind</IonLabel>
                    <Controller
                        control={form.control}
                        name="repeatKind"
                        render={({ field: { onChange, value, name } }) => (
                            <IonSelect name={name} value={value} onIonChange={onChange} placeholder="Repeat kind" disabled={!dateValue}>
                                <IonSelectOption value={TaskRepeatKindEnum.Daily}>Daily</IonSelectOption>
                                <IonSelectOption value={TaskRepeatKindEnum.Weekdays}>Weekdays</IonSelectOption>
                                <IonSelectOption value={TaskRepeatKindEnum.Weekends}>Weekends</IonSelectOption>
                                <IonSelectOption value={TaskRepeatKindEnum.Weekly}>Weekly</IonSelectOption>
                                <IonSelectOption value={TaskRepeatKindEnum.Monthly}>Monthly</IonSelectOption>
                                <IonSelectOption value={TaskRepeatKindEnum.Yearly}>Yearly</IonSelectOption>
                            </IonSelect>
                        )}
                    />
                </IonItem>

                <IonItem className={ionInvalidClass("repeatTimes")}>
                    <IonLabel>Times</IonLabel>
                    <Controller
                        control={form.control}
                        name="repeatTimes"
                        rules={{ min: minRepeatTimes }}
                        render={({ field: { onChange, value, name } }) => (
                            <IonInput name={name} value={value} onIonChange={onChange} type="number" min={minRepeatTimes} />
                        )}
                    />
                    <IonNote slot="error" color="danger">
                        Cannot be negative or lower than number of completed iterations
                    </IonNote>
                </IonItem>
            </IonList>
        </FormProvider>
    );
};

const TaskEditScreen: React.FC = () => {
    const params = useParams<{ taskId: string }>();
    const history = useHistory();
    const task = useStore((state) => state.taskSlice.tasks.find((task) => task.id === params?.taskId));
    const addTask = useStore((state) => state.taskSlice.add);
    const updateTask = useStore((state) => state.taskSlice.update);
    const removeTask = useStore((state) => state.taskSlice.remove);

    const formMethods = useForm<FormInputs>({
        defaultValues: {
            title: task?.title ?? "",
            description: task?.description ?? "",
            importance: task?.importance ?? TaskImportanceEnum.Ordinary,
            date: task?.date
                ? task.date.getDay() + "-" + task.date.getMonth() + "-" + task.date.getFullYear()
                : undefined,
            time: task?.date ? task.date.getHours() + ":" + task.date.getMinutes() : undefined,
            repeatKind: task?.repeatKind ?? undefined,
            repeatTimes: task?.repeatTimes ?? 1,
        },
    });

    const onSubmit = (data: FormInputs) => {
        const date = data.date ? new Date(data.date + " " + (data.time ?? "")) : undefined;

        if (task) {
            updateTask(task.id, {
                title: data.title,
                description: data.description,
                repeatKind: data.repeatKind,
                repeatTimes: +data.repeatTimes,
                importance: data.importance,
                date: date,
            });
        } else {
            // TODO: Process dream binding

            addTask({
                title: data.title,
                description: data.description,
                repeatKind: data.repeatKind,
                repeatTimes: +data.repeatTimes,
                importance: data.importance,
                date: date
            });
        }

        history.push("/tabs/tasks");
    };

    const onRemove = () => {
        if (task) {
            removeTask(task.id);
        }

        history.push("/tabs/tasks");
    };

    const minRepeatTimes = task?.index ? task.index + 1 : 1;

    return (
        <EditScreen
            id="edit-task"
            title="Task Edit"
            form={<Form form={formMethods} minRepeatTimes={minRepeatTimes} />}
            fabSaveOnClick={formMethods.handleSubmit(onSubmit)}
            fabRemoveOnClick={onRemove}
        />
    );
};

export default TaskEditScreen;
