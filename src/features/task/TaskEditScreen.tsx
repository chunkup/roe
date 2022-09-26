import { IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonRadio, IonRadioGroup, IonTextarea, useIonRouter } from "@ionic/react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

import { TaskIterationImportanceEnum } from "./store/task-iteration-importance-enum";
import EditScreen from "../../components/EditScreen";

import "../../theme/radio.css";
import { useStore } from "../../store";
import { useHistory } from "react-router";

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
    const history = useHistory();
    const storeAddTask = useStore((state) => state.taskSlice.add);

    const formMethods = useForm<FormInputs>({
        defaultValues: {
            title: "",
            description: "",
            importance: TaskIterationImportanceEnum.Ordinary,
        },
    });

    const onSubmit = (data: FormInputs) => {
        storeAddTask({ title: data.title, description: data.description }, { importance: data.importance });
        history.push("/tabs/tasks");
    }

    return (
        <EditScreen
            id="task-edit"
            title="Task Edit"
            form={<Form formMethods={formMethods} />}
            fabSaveOnClick={formMethods.handleSubmit(onSubmit)}
        />
    );
};

export default TaskEditScreen;
