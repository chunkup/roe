import { IonButton, IonDatetime, IonDatetimeButton, IonLabel, IonModal } from "@ionic/react";
import { useEffect } from "react";

let dateTimeModalUniqueId = 0;

export type DateTimeInputProps = {
    presentation: "date" | "time";
    name: string;
    value: string | null;
    onChange: (value: string | string[] | null | undefined) => void;
    placeholder?: string;
    min: string;
};

/**
 * Wrapper for the IonDatetimeButton + IonDatetime + IonModal components with clear button and some API simplifications.
 */
export const DateTimeInput: React.FC<DateTimeInputProps> = ({ presentation, name, value, onChange, min, placeholder }) => {
    const placeholderSlot = presentation === "time" ? "time-target" : "date-target";
    const id = `date-time-modal-${dateTimeModalUniqueId}`;

    useEffect(() => {
        dateTimeModalUniqueId++;
    }, []);

    return (
        <>
            <IonDatetimeButton datetime={id}>
                {!value && placeholder && <IonLabel slot={placeholderSlot}>{placeholder}</IonLabel>}
            </IonDatetimeButton>

            <IonModal keepContentsMounted={true}>
                <IonDatetime
                    id={id}
                    name={name}
                    value={value}
                    presentation={presentation}
                    min={min}
                    onIonChange={(e) => onChange(e.detail.value)}
                ></IonDatetime>
            </IonModal>

            {value && (
                <IonButton fill="clear" onClick={() => onChange(null)}>
                    Clear
                </IonButton>
            )}
        </>
    );
};
