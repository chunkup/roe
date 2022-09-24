import { IonCheckbox, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { starOutline } from 'ionicons/icons';
import HomeScreen from '../../components/HomeScreen';
import { useStore } from '../../store';

const RewardsList = () => {
    const rewards = useStore(state => state.rewardSlice.rewards);
    const toggleReward = useStore(state => state.rewardSlice.toggle);

    return (
        <IonList>
            {
                rewards.map(reward => (
                    <IonItem key={reward.id}>
                        { reward.dreamId && <IonIcon icon={starOutline} slot="start" /> }

                        { !reward.dreamId && <IonCheckbox slot="start" checked={reward.bought} onClick={() => toggleReward(reward.id)}/>}

                        <IonLabel>
                            {reward.title}
                        </IonLabel>

                        <IonLabel slot="end">
                            {reward.price}
                        </IonLabel>
                    </IonItem>
                ))
            }
        </IonList>
    );
}

const RewardsScreen: React.FC = () => {
    const addReward = useStore(state => state.rewardSlice.add);

    const fabOnClick = () => {
        addReward({
            title: 'Reward',
            price: 1,
        });
    }

    return (
        <HomeScreen id="rewards-screen" title="Rewards" list={<RewardsList />} fabOnClick={fabOnClick}/>
    );
};

export default RewardsScreen;
