import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonTextarea } from "@ionic/react";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import EditScreen from "../../components/EditScreen";
import { useStore } from "../../store";

type FormInputs = {
    title: string;
    description: string;
    price: number;
};

const Form: React.FC<{ form: UseFormReturn<FormInputs> }> = ({ form }) => {
    const ionInvalidClass = (name: keyof FormInputs) => (form.formState.isSubmitted && form.getFieldState(name).error ? "ion-invalid" : "");

    return (
        <form>
            <IonList>
                <IonListHeader>
                    <IonLabel>Title</IonLabel>
                </IonListHeader>

                <IonItem className={ionInvalidClass("title")}>
                    <IonInput {...form.register("title", { required: true })} autofocus={true} />
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
        </form>
    );
};

const RewardEditScreen: React.FC = () => {
    const params = useParams<{ rewardId: string }>();
    const history = useHistory();
    const form = useForm<FormInputs>();
    const reward = useStore((state) => state.rewardSlice.rewards.find((reward) => reward.id === params.rewardId));
    const addReward = useStore((state) => state.rewardSlice.add);
    const updateReward = useStore((state) => state.rewardSlice.update);
    const removeReward = useStore((state) => state.rewardSlice.remove);

    useEffect(() => {
        form.reset({
            title: reward?.title ?? "",
            description: reward?.description ?? "",
            price: reward?.price ?? 0,
        });
    }, [reward, form]);

    const onSubmit = (data: FormInputs) => {
        if (reward) {
            updateReward(reward.id, { title: data.title, description: data.description, price: data.price });
        } else {
            addReward({ title: data.title, description: data.description, price: data.price });
        }

        history.push("/tabs/rewards");
    };

    const onRemove = () => {
        if (reward) {
            removeReward(reward.id);
        }

        history.push("/tabs/rewards");
    };

    return (
        <EditScreen
            id="edit-reward"
            title="Reward Edit"
            form={<Form form={form} />}
            fabSaveOnClick={form.handleSubmit(onSubmit)}
            fabRemoveOnClick={reward && onRemove}
        />
    );
};

export default RewardEditScreen;
