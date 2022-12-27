import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonItemGroup,
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
import { checkmark, starOutline, trophyOutline } from "ionicons/icons";
import { useRef } from "react";
import { useLocation } from "react-router";
import { Redirect, Route } from "react-router-dom";
import { DreamEditScreen } from "./features/dream/dream-edit.screen";
import { DreamsScreen } from "./features/dream/dreams.screen";
import { RewardEditScreen } from "./features/reward/reward-edit.screen";
import { RewardsScreen } from "./features/reward/rewards.screen";
import { TaskPeriodEnum } from "./features/task/store/task-period.enum";
import { TaskEditScreen } from "./features/task/task-edit.screen";
import { TasksScreen } from "./features/task/tasks.screen";
import { useStore } from "./store";

const Drawer: React.FC = () => {
    const menu = useRef<HTMLIonMenuElement>(null);
    const location = useLocation();
    const setTaskPeriod = useStore((state) => state.taskSlice.setTaskPeriod);

    const onPeriodItemClick = (period: TaskPeriodEnum) => {
        setTaskPeriod(period);
        menu.current?.close();
    };

    return (
        <IonMenu ref={menu} side="start" menuId="drawer" contentId="tabs">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Drawer</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {location.pathname === "/tabs/tasks" && (
                    <IonList>
                        <IonItemGroup>
                            <IonItemDivider>
                                <IonLabel>Tasks period</IonLabel>
                            </IonItemDivider>

                            {Object.values(TaskPeriodEnum).map((period) => (
                                <IonItem button key={period} onClick={() => onPeriodItemClick(period)}>
                                    {period}
                                </IonItem>
                            ))}
                        </IonItemGroup>
                    </IonList>
                )}
            </IonContent>
        </IonMenu>
    );
};

const Tabs = () => {
    return (
        <>
            <Drawer />

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

            <Route exact path="/tasks/add">
                <TaskEditScreen />
            </Route>

            <Route exact path="/tasks/:taskId">
                <TaskEditScreen />
            </Route>

            <Route exact path="/dreams/add">
                <DreamEditScreen />
            </Route>

            <Route exact path="/dreams/:dreamId">
                <DreamEditScreen />
            </Route>

            <Route exact path="/dreams/:dreamId/task">
                <TaskEditScreen />
            </Route>

            <Route exact path="/dreams/:dreamId/task/:taskId">
                <TaskEditScreen />
            </Route>

            <Route exact path="/dreams/:dreamId/reward">
                <RewardEditScreen />
            </Route>

            <Route exact path="/dreams/:dreamId/reward/:rewardId">
                <RewardEditScreen />
            </Route>

            <Route exact path="/rewards/add">
                <RewardEditScreen />
            </Route>

            <Route exact path="/rewards/:rewardId">
                <RewardEditScreen />
            </Route>
        </IonRouterOutlet>
    );
};
