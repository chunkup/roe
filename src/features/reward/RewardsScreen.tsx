import { IonCheckbox, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { starOutline } from "ionicons/icons";
import HomeScreen from "../../components/HomeScreen";
import { useStore } from "../../store";
import { Reward } from "./store/reward.store";

const RewardItem = ({ reward }: { reward: Reward }) => {
    const rewardToggle = useStore((state) => state.rewardSlice.toggle);
    const userBalance = useStore((state) => state.userSlice.balance);

    const rewardBuyable = reward.bought || userBalance >= reward?.price;

    return (
        <IonItem routerLink={"../edit-reward/" + reward.id}>
            {reward.dreamId ? (
                <IonIcon icon={starOutline} slot="start" />
            ) : (
                <IonCheckbox
                    slot="start"
                    checked={reward.bought}
                    disabled={!rewardBuyable}
                    onClick={(e) => e.stopPropagation()}
                    onIonChange={() => rewardToggle(reward.id)}
                />
            )}

            <IonLabel>
                {reward.title}
                {reward.description && <p>{reward.description}</p>}
            </IonLabel>

            {!reward.dreamId && <IonLabel slot="end">{reward.price}</IonLabel>}
        </IonItem>
    );
};

const RewardsList = () => {
    const rewards = useStore((state) => state.rewardSlice.rewards);

    return (
        <IonList>
            {rewards.map((reward) => (
                <RewardItem reward={reward} key={reward.id} />
            ))}
        </IonList>
    );
};

const RewardsScreen: React.FC = () => {
    const userBalance = useStore((state) => state.userSlice.balance);

    return (
        <HomeScreen
            id="rewards-screen"
            title="Rewards"
            list={<RewardsList />}
            toolbarRight={<IonLabel class="ion-margin-horizontal">{userBalance}</IonLabel>}
            fabRouterLink="../add-reward"
        />
    );
};

export default RewardsScreen;
