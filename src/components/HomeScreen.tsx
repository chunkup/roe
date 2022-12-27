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
    IonToolbar,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useRemoveEmptyDreams } from "../features/dream/store/useRemoveEmptyDreams";

interface HomeScreenProps {
    id: string;
    title: string;
    list?: any;
    fabRouterLink?: string;
    toolbarRight?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ id, title, list, fabRouterLink, toolbarRight }) => {
    useRemoveEmptyDreams();

    return (
        <IonPage id={id}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>

                    <IonTitle>{title} </IonTitle>

                    <IonButtons slot="end">{toolbarRight}</IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>
                {list}

                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton routerLink={fabRouterLink}>
                        <IonIcon icon={addCircleOutline} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};
