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
    IonToolbar
} from '@ionic/react';
import { saveOutline, trashBinOutline } from 'ionicons/icons';

interface EditScreenProps {
    id: string,
    title: string
    form: any
    fabSaveOnClick?: () => void
    fabRemoveOnClick?: () => void
}

const EditScreen: React.FC<EditScreenProps> = ({ id, title, form, fabSaveOnClick, fabRemoveOnClick: fabDeleteOnClick }) => {
    return (
        <IonPage id={id}>
            <IonHeader>
                <IonToolbar >
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>

                    <IonTitle>{ title } </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>
                { form }

                <IonFab vertical="bottom" horizontal="center" slot="fixed" style={{ display: 'flex' }}>
                    <IonFabButton style={{ marginLeft: 5, marginRight: 5 }}>
                        <IonIcon icon={saveOutline} onClick={fabSaveOnClick} />
                    </IonFabButton>

                    <IonFabButton style={{ marginLeft: 5, marginRight: 5 }}>
                        <IonIcon icon={trashBinOutline} onClick={fabDeleteOnClick} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default EditScreen;