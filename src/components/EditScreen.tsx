import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { saveOutline, trashBinOutline } from "ionicons/icons";

interface EditScreenProps {
    id: string;
    title: string;
    form: any;
    fabSaveOnClick?: () => void;
    fabRemoveOnClick?: () => void;
}

const style = {
    display: "flex",
    left: "50%",
    transform: "translateX(-50%)",
};

const EditScreen: React.FC<EditScreenProps> = ({ id, title, form, fabSaveOnClick, fabRemoveOnClick }) => {
    return (
        <IonPage id={id}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>

                    <IonTitle>{title} </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>
                {form}

                <IonFab vertical="bottom" slot="fixed" style={style}>
                    <IonFabButton className="ion-margin-end">
                        <IonIcon icon={saveOutline} onClick={fabSaveOnClick} />
                    </IonFabButton>

                    {fabRemoveOnClick && (
                        <IonFabButton className="ion-margin-start">
                            <IonIcon icon={trashBinOutline} onClick={fabRemoveOnClick} />
                        </IonFabButton>
                    )}
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default EditScreen;
