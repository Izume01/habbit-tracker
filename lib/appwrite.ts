import { Account, Client, Databases } from 'react-native-appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || ''
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || ''
const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || ''


if (!endpoint || !projectId || !platform) {
    console.error('⚠️ APPWRITE CONFIGURATION ERROR: Missing environment variables!');
    console.error('Please create a .env file with the required variables. See .env.example');
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)

const account = new Account(client)
const databases = new Databases(client)

export { account, client, databases };
