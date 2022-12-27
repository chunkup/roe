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
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import { EditScreen } from "../../components/EditScreen";
import { useStore } from "../../store";
import { TaskImportanceEnum } from "./store/task-importance.enum";
import { TaskRepeatKindEnum } from "./store/task-repeat-kind.enum";

import { DateTimeInput } from "../../components/DateTimeInput";
import "../../theme/radio.css";

// TODO: Improve processing MIN/MAX dates, repeat times accordingly to the date, creating new iteration accordingly to the date, etc

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
    const repeatKindValue = form.watch("repeatKind");

    return (
        <form>
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
                            <DateTimeInput
                                presentation="date"
                                name={name}
                                value={value}
                                onChange={onChange}
                                placeholder="Select date"
                                min="2000-01-01T00:00:00.000Z"
                            />
                        )}
                    />
                </IonItem>

                {dateValue && (
                    <IonItem>
                        <IonLabel>Time</IonLabel>
                        <Controller
                            control={form.control}
                            name="time"
                            render={({ field: { onChange, value, name } }) => (
                                <DateTimeInput
                                    presentation="time"
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Select time"
                                    min="2000-01-01T00:00:00.000Z"
                                />
                            )}
                        />
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
                            <IonSelect name={name} value={value} onIonChange={onChange} placeholder="Repeat kind" interface="action-sheet">
                                {Object.values(TaskRepeatKindEnum).map((kind) => (
                                    <IonSelectOption key={kind} value={kind}>
                                        {kind}
                                    </IonSelectOption>
                                ))}
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
                            <IonInput
                                name={name}
                                value={value}
                                onIonChange={onChange}
                                type="number"
                                min={minRepeatTimes}
                                disabled={!repeatKindValue || repeatKindValue === TaskRepeatKindEnum.None}
                            />
                        )}
                    />
                    {minRepeatTimes > 1 && <IonLabel slot="end">Current iteration: {minRepeatTimes}</IonLabel>}
                    <IonNote slot="error" color="danger">
                        Cannot be negative or lower than number of completed iterations
                    </IonNote>
                </IonItem>
            </IonList>
        </form>
    );
};

export const TaskEditScreen: React.FC = () => {
    const params = useParams<{ taskId: string; dreamId: string }>();
    const history = useHistory();
    const task = useStore((state) => state.taskSlice.tasks.find((task) => task.id === params?.taskId));
    const addTask = useStore((state) => state.taskSlice.add);
    const updateTask = useStore((state) => state.taskSlice.update);
    const removeTask = useStore((state) => state.taskSlice.remove);

    const form = useForm<FormInputs>({
        defaultValues: {
            title: task?.title ?? "",
            description: task?.description ?? "",
            importance: task?.importance ?? TaskImportanceEnum.Ordinary,
            date: task?.date ? new Date(task.date).toISOString() : undefined,
            time: task?.time ? new Date(task.time).toISOString() : undefined,
            repeatKind: task?.repeatKind ?? TaskRepeatKindEnum.None,
            repeatTimes: task?.repeatTimes ?? 1,
        },
    });

    const onSubmit = (data: FormInputs) => {
        const date = data.date ? new Date(data.date) : undefined;
        const time = data.time ? new Date(data.time) : undefined;

        if (task) {
            updateTask(task.id, {
                ...data,
                index: task.index,
                dreamId: task.dreamId,
                importance: data.importance,
                date: date ? +date : undefined,
                time: date && time ? +time : undefined,
            });
        } else {
            addTask({
                ...data,
                index: 0,
                dreamId: params.dreamId,
                date: date ? +date : undefined,
                time: date && time ? +time : undefined,
            });
        }

        history.goBack();
    };

    const onRemove = () => {
        if (task) {
            removeTask(task.id);
        }

        history.goBack();
    };

    return (
        <EditScreen
            id="edit-task"
            title="Task Edit"
            form={<Form form={form} minRepeatTimes={task?.index ? task.index + 1 : 1} />}
            fabSaveOnClick={form.handleSubmit(onSubmit)}
            fabRemoveOnClick={task && onRemove}
        />
    );
};
