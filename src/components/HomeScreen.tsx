import {
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';

interface HomeScreenProps {
    id: string,
    title: string
    list?: any
    fabOnClick?: () => void
}

const HomeScreen: React.FC<HomeScreenProps> = ({ id, title, list, fabOnClick: fabClick }) => {
    return (
        <IonPage id={id}>
            <IonHeader>
                <IonToolbar >
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>

                    <IonTitle>{ title } </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>
                { list }

                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton>
                        <IonIcon icon={addCircleOutline} onClick={fabClick} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default HomeScreen;