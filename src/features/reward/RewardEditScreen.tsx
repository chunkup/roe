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
    const storeReward = useStore((state) => state.rewardSlice.rewards.find((reward) => reward.id === params.rewardId));
    const storeAddReward = useStore((state) => state.rewardSlice.add);
    const storeUpdateReward = useStore((state) => state.rewardSlice.update);
    const storeRemoveReward = useStore((state) => state.rewardSlice.remove);

    const formMethods = useForm<FormInputs>({
        defaultValues: {
            title: storeReward?.title ?? "",
            description: storeReward?.description ?? "",
            price: storeReward?.price ?? 0,
        },
    });

    const onSubmit = (data: FormInputs) => {
        if (storeReward) {
            storeUpdateReward(storeReward.id, { title: data.title, description: data.description, price: data.price });
        } else {
            storeAddReward({ title: data.title, description: data.description, price: data.price });
        }

        history.push("/tabs/rewards");
    };

    const onRemove = () => {
        if (storeReward) {
            storeRemoveReward(storeReward.id);
        }

        history.push("/tabs/rewards");
    };

    return (
        <EditScreen
            id="edit-reward"
            title="Reward Edit"
            form={<Form formMethods={formMethods} />}
            fabSaveOnClick={formMethods.handleSubmit(onSubmit)}
            fabRemoveOnClick={onRemove}
        />
    );
};

export default RewardEditScreen;
