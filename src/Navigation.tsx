import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { checkmark, starOutline, trophyOutline } from "ionicons/icons";

import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";

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
                            <Home />
                        </Route>

                        <Route exact path="/tabs/dreams">
                            <Home />
                        </Route>

                        <Route path="/tabs/rewards">
                            <Home />
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

            <Route path="/message/:id">
                <ViewMessage />
            </Route>
        </IonRouterOutlet>
    );
};

export default Navigation;
