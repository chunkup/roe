import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonTextarea } from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

import EditScreen from "../../components/EditScreen";
import { useStore } from "../../store";

type FormInputs = {
    title: string;
    description: string;
    price: number;
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
                    <IonInput {...formMethods.register("title", { required: true })} autofocus={true} />
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

            <IonList>
                <IonListHeader>
                    <IonLabel>Price</IonLabel>
                </IonListHeader>

                <IonItem className={ionInvalidClass("price")}>
                    <IonInput {...formMethods.register("price", { required: true })} />
                    <IonNote slot="error" color="danger">
                        Required
                    </IonNote>
                </IonItem>
            </IonList>
        </FormProvider>
    );
};

const RewardEditScreen: React.FC = () => {
    const params = useParams<{ rewardId: string }>();
    const history = useHistory();
    const reward = useStore((state) => state.rewardSlice.rewards.find((reward) => reward.id === params.rewardId));
    const addReward = useStore((state) => state.rewardSlice.add);
    const updateReward = useStore((state) => state.rewardSlice.update);
    const removeReward = useStore((state) => state.rewardSlice.remove);

    const formMethods = useForm<FormInputs>({
        defaultValues: {
            title: reward?.title ?? "",
            description: reward?.description ?? "",
            price: reward?.price ?? 0,
        },
    });

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
            form={<Form formMethods={formMethods} />}
            fabSaveOnClick={formMethods.handleSubmit(onSubmit)}
            fabRemoveOnClick={reward && onRemove}
        />
    );
};

export default RewardEditScreen;
