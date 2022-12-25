import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import "./theme/variables.css";

import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { setupStorage } from "./storage";
import { setupStore } from "./store";

async function setup() {
    await setupStorage();
    await setupStore();

    return true;
}

setupIonicReact();

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setup().then(() => setLoading(false));
    }, []);

    if (loading) {
        return null;
    }

    return (
        <IonApp>
            <IonReactRouter>
                <Navigation />
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
