import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonTextarea } from "@ionic/react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import { EditScreen } from "../../components/EditScreen";
import { useStore } from "../../store";

type FormInputs = {
    title: string;
    description: string;
};

const Form: React.FC<{ form: UseFormReturn<FormInputs>; dreamId: string }> = ({ form, dreamId }) => {
    const history = useHistory();
    const ionInvalidClass = (name: keyof FormInputs) => (form.formState.isSubmitted && form.getFieldState(name).error ? "ion-invalid" : "");
    const tasks = useStore((state) => state.taskSlice.tasks.filter((task) => task.dreamId === dreamId));
    const rewards = useStore((state) => state.rewardSlice.rewards.filter((reward) => reward.dreamId === dreamId));

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

                <IonListHeader>
                    <IonLabel>Tasks</IonLabel>
                </IonListHeader>

                {tasks.map((task) => (
                    <IonItem key={task.id} onClick={() => history.push("/dream/" + dreamId + "/task/" + task.id)}>
                        <IonLabel>
                            {task.title}
                            {task.description && <p>{task.description}</p>}
                        </IonLabel>
                    </IonItem>
                ))}

                <IonItem button onClick={() => history.push("/dreams/" + dreamId + "/task")}>
                    <IonLabel>Add Task</IonLabel>
                </IonItem>

                <IonListHeader>
                    <IonLabel>Rewards</IonLabel>
                </IonListHeader>

                {rewards.map((reward) => (
                    <IonItem key={reward.id} onClick={() => history.push("/dream/" + dreamId + "/reward/" + reward.id)}>
                        <IonLabel>
                            {reward.title}
                            {reward.description && <p>{reward.description}</p>}
                        </IonLabel>
                    </IonItem>
                ))}

                <IonItem button onClick={() => history.push("/dreams/" + dreamId + "/reward")}>
                    <IonLabel>Add Reward</IonLabel>
                </IonItem>
            </IonList>
        </form>
    );
};

export const DreamEditScreen: React.FC = () => {
    const params = useParams<{ dreamId: string }>();
    const history = useHistory();
    const dream = useStore((state) => state.dreamSlice.dreams.find((dream) => dream.id === params.dreamId));
    const [dreamId] = useState(dream?.id ?? nanoid());
    const addDream = useStore((state) => state.dreamSlice.add);
    const updateDream = useStore((state) => state.dreamSlice.update);
    const removeDream = useStore((state) => state.dreamSlice.remove);

    const form = useForm<FormInputs>({
        defaultValues: {
            title: dream?.title ?? "",
            description: dream?.description ?? "",
        },
    });

    useEffect(() => {
        if (!dream) {
            // Add dream and if it would left empty, remove it on rendering the home screen
            addDream({ id: dreamId, title: "" });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // clear alert on location change
        const unlisten = history.listen(() => {
            updateDream(dreamId, { title: form.getValues("title"), description: form.getValues("description") });
        });

        // stop the listener when component unmounts
        return unlisten;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (data: FormInputs) => {
        history.goBack();
    };

    const onRemove = () => {
        removeDream(dreamId);
        history.goBack();
    };

    return (
        <EditScreen
            id="edit-dream"
            title="Dream Edit"
            form={<Form form={form} dreamId={dreamId} />}
            fabSaveOnClick={form.handleSubmit(onSubmit)}
            fabRemoveOnClick={dream && onRemove}
        />
    );
};
