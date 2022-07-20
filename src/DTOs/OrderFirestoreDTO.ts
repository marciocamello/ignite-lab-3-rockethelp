import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FilterType } from "../components/Filter";

export type OrderFirestoreDTO = {
    patrimony: string;
    description: string;
    status: FilterType;
    solution?: string;
    created_at: FirebaseFirestoreTypes.Timestamp;
    closed_at?: FirebaseFirestoreTypes.Timestamp;
}