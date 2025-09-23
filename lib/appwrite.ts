import { Account, Client, Databases , ID , TablesDB } from 'react-native-appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || ''
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || ''
const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || ''
export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID || ''
export const TABLE_ID = process.env.EXPO_PUBLIC_TABLE_ID || ''


if (!endpoint || !projectId || !platform || !DATABASE_ID || !TABLE_ID) {
    console.error('⚠️ APPWRITE CONFIGURATION ERROR: Missing environment variables!');
    console.error('Please create a .env file with the required variables. See .env.example');
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)

const account = new Account(client)
const tablesDB  = new TablesDB(client)
export { account, client, tablesDB  };
