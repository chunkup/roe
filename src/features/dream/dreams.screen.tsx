import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/react";
import { HomeScreen } from "../../components/HomeScreen";
import { useStore } from "../../store";
import { Dream } from "./store/dream.store";

const DreamItem = ({ dream }: { dream: Dream }) => {
    return (
        <IonItem routerLink={"/dreams/" + dream.id}>
            <IonCheckbox slot="start" checked={dream.completed} onIonChange={(e) => (e.target.checked = dream.completed)} />

            <IonLabel>
                {dream.title}
                {dream.description && <p>{dream.description}</p>}
            </IonLabel>

            {!dream.completed && <IonLabel slot="end">{dream.completionPercent}%</IonLabel>}
        </IonItem>
    );
};

const DreamsList = () => {
    const dreams = useStore((state) => state.dreamSlice.dreams);

    return (
        <IonList>
            {dreams.map((dream) => (
                <DreamItem dream={dream} key={dream.id} />
            ))}
        </IonList>
    );
};

export const DreamsScreen: React.FC = () => {
    return <HomeScreen id="dreams-screen" title="Dreams" list={<DreamsList />} fabRouterLink="/dreams/add" />;
};
