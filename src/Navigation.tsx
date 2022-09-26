import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { checkmark, starOutline, trophyOutline } from "ionicons/icons";

import TasksScreen from "./features/task/TasksScreen";
import DreamsScreen from "./features/dream/DreamsScreen";
import RewardsScreen from "./features/reward/RewardsScreen";
import TaskEditScreen from "./features/task/TaskEditScreen";

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
                        <Redirect exact path="/tabs" to="/tabs/tasks" />

                        <Route exact path="/tabs/tasks">
                            <TasksScreen />
                        </Route>

                        <Route exact path="/tabs/dreams">
                            <DreamsScreen />
                        </Route>

                        <Route path="/tabs/rewards">
                            <RewardsScreen />
                        </Route>
                    </IonRouterOutlet>

                    <IonTabBar slot="bottom">
                        <IonTabButton tab="tasks" href="/tabs/tasks">
                            <IonIcon icon={checkmark} />
                            <IonLabel>Tasks</IonLabel>
                        </IonTabButton>

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
            <Route path="/" exact={true}>
                <Redirect to="/tabs" />
            </Route>

            <Route path="/tabs">
                <Tabs />
            </Route>

            <Route path="/add-task">
                <TaskEditScreen />
            </Route>

            <Route path="/task-edit">
                <TaskEditScreen />
            </Route>
        </IonRouterOutlet>
    );
};

export default Navigation;
