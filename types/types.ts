import { Models } from "react-native-appwrite";

export interface Habbits extends Models.Document {
    title : string
    description : string
    frequency : string
    last_completed : string
    streak_count : number
    user_id : string
}
