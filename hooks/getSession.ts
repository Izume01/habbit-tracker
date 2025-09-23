import { account } from "../lib/appwrite";

const getUserSession = async () => {
    try {
        const user = await account.get();
        console.log("✅ Active session found:", user.email);
        return user;
    } catch (error: any) {
        // 401 errors are expected when no session exists - this is normal behavior
        if (error.code === 401) {
            console.log("ℹ️ No active session (this is normal on first load)");
        } else {
            console.error("❌ Unexpected error checking session:", error);
        }
        return null;
    }
}

export default getUserSession;