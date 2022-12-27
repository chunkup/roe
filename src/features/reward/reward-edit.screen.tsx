import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonTextarea } from "@ionic/react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import { EditScreen } from "../../components/EditScreen";
import { useStore } from "../../store";

type FormInputs = {
    title: string;
    description: string;
    price: number;
};

const Form: React.FC<{ form: UseFormReturn<FormInputs>; dream: boolean }> = ({ form, dream }) => {
    const ionInvalidClass = (name: keyof FormInputs) => (form.formState.isSubmitted && form.getFieldState(name).error ? "ion-invalid" : "");

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

            {!dream && (
                <IonList>
                    <IonListHeader>
                        <IonLabel>Price</IonLabel>
                    </IonListHeader>

                    <IonItem className={ionInvalidClass("price")}>
                        <IonInput {...form.register("price", { required: true })} />
                        <IonNote slot="error" color="danger">
                            Required
                        </IonNote>
                    </IonItem>
                </IonList>
            )}
        </form>
    );
};

export const RewardEditScreen: React.FC = () => {
    const params = useParams<{ rewardId: string; dreamId: string }>();
    const history = useHistory();
    const reward = useStore((state) => state.rewardSlice.rewards.find((reward) => reward.id === params.rewardId));
    const addReward = useStore((state) => state.rewardSlice.add);
    const updateReward = useStore((state) => state.rewardSlice.update);
    const removeReward = useStore((state) => state.rewardSlice.remove);

    const form = useForm<FormInputs>({
        defaultValues: {
            title: reward?.title ?? "",
            description: reward?.description ?? "",
            price: reward?.price ?? 0,
        },
    });

    const onSubmit = (data: FormInputs) => {
        if (reward) {
            updateReward(reward.id, { dreamId: reward.dreamId, title: data.title, description: data.description, price: data.price || 0 });
        } else {
            addReward({ dreamId: params.dreamId, title: data.title, description: data.description, price: data.price || 0 });
        }

        history.goBack();
    };

    const onRemove = () => {
        if (reward) {
            removeReward(reward.id);
        }

        history.goBack();
    };

    return (
        <EditScreen
            id="edit-reward"
            title="Reward Edit"
            form={<Form form={form} dream={!!(params.dreamId || reward?.dreamId)} />}
            fabSaveOnClick={form.handleSubmit(onSubmit)}
            fabRemoveOnClick={reward && onRemove}
        />
    );
};
