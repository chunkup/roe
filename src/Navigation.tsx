import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { checkmark, starOutline, trophyOutline } from "ionicons/icons";

import TasksScreen from "./features/task/tasks.screen";
import DreamsScreen from "./features/dream/dreams.screen";
import RewardsScreen from "./features/reward/rewards.screen";
import TaskEditScreen from "./features/task/task-edit.screen";
import RewardEditScreen from "./features/reward/reward-edit.screen";

const Tabs = () => {
    return (
        <>
            <IonMenu side="start" menuId="drawer" contentId="tabs">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Drawer</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonList>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonContent scrollX={false} scrollY={false} id="tabs">
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/tabs">
                            <Redirect to="/tabs/tasks" />
                        </Route>

                        <Route exact path="/tabs/tasks">
                            <TasksScreen />
                        </Route>

                        <Route exact path="/tabs/dreams">
                            <DreamsScreen />
                        </Route>

                        <Route exact path="/tabs/rewards">
                            <RewardsScreen />
                        </Route>
                    </IonRouterOutlet>

                    <IonTabBar slot="bottom">
                        <IonTabButton tab="tasks" href="/tabs/tasks">
                            <IonIcon icon={checkmark} />
                            <IonLabel>Tasks</IonLabel>
                        </IonTabButton>
                        s
                        <IonTabButton tab="dreams" href="/tabs/dreams">
                            <IonIcon icon={starOutline} />
                            <IonLabel>Dreams</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="rewards" href="/tabs/rewards">
                            <IonIcon icon={trophyOutline} />
                            <IonLabel>Rewards</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonContent>
        </>
    );
};

export const Navigation: React.FC = () => {
    return (
        <IonRouterOutlet>
            <Route exact path="/">
                <Redirect to="/tabs" />
            </Route>

            <Route path="/tabs">
                <Tabs />
            </Route>

            <Route path="/tasks/add">
                <TaskEditScreen />
            </Route>

            <Route path="/tasks/:taskIterationId">
                <TaskEditScreen />
            </Route>

            <Route path="/rewards/add">
                <RewardEditScreen />
            </Route>

            <Route path="/rewards/:rewardId">
                <RewardEditScreen />
            </Route>
        </IonRouterOutlet>
    );
};

export default Navigation;
