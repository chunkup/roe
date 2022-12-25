import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonTextarea } from "@ionic/react";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import { EditScreen } from "../../components/EditScreen";
import { useStore } from "../../store";

type FormInputs = {
    title: string;
    description: string;
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
        </form>
    );
};

export const DreamEditScreen: React.FC = () => {
    const params = useParams<{ dreamId: string }>();
    const history = useHistory();
    const form = useForm<FormInputs>();
    const dream = useStore((state) => state.dreamSlice.dreams.find((dream) => dream.id === params.dreamId));
    const addDream = useStore((state) => state.dreamSlice.add);
    const updateDream = useStore((state) => state.dreamSlice.update);
    const removeDream = useStore((state) => state.dreamSlice.remove);

    useEffect(() => {
        form.reset({
            title: dream?.title ?? "",
            description: dream?.description ?? "",
        });
    }, [dream, form]);

    const onSubmit = (data: FormInputs) => {
        if (dream) {
            updateDream(dream.id, { title: data.title, description: data.description });
        } else {
            addDream({ title: data.title, description: data.description });
        }

        history.push("/tabs/dreams");
    };

    const onRemove = () => {
        if (dream) {
            removeDream(dream.id);
        }

        history.push("/tabs/dreams");
    };

    return (
        <EditScreen
            id="edit-dream"
            title="Dream Edit"
            form={<Form form={form} />}
            fabSaveOnClick={form.handleSubmit(onSubmit)}
            fabRemoveOnClick={dream && onRemove}
        />
    );
};
