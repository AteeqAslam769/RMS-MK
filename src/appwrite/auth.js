import { Client, Account, ID, Databases, Query } from 'appwrite';
import conf from '../config/conf';

class appwriteAuth {
    client;
    account;
    databases;
    
    constructor() {
        this.client = new Client();
        this.client.setEndpoint(conf.appwriteUrl);
        this.client.setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);  // Initialize Databases API
    }

    async signUp({ email, password }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password
            );
            if (userAccount) {
                // Assign a default label after signup
                await this.assignLabelToUser(userAccount.$id, "User"); 
                return userAccount;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(
                email,
                password
            );
        } catch (error) {
            console.error(error);
        }
    }

    async checkCurrentUserStatus() {
        try {
            return await this.account.get();
        } catch (error) {
            return false;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error(error);
        }
    }

    // Function to assign a label to a user
    async assignLabelToUser(userId, label) {
        try {
            // Assuming you've created a collection called 'userLabels'
            const collectionId = conf.appwriteUserLabelsCollectionId;

            const document = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                collectionId, 
                ID.unique(), // Create a unique document ID
                { userId, label } // Assign the label to the user
            );
            
            return document;
        } catch (error) {
            console.error("Error assigning label: ", error);
        }
    }

    // Function to get the label of the current user
    async getUserLabel(userId) {
        try {
            const collectionId = conf.appwriteUserLabelsCollectionId;
            
            
            const documents = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                collectionId, 
                [
                Query.equal(`userId`,[`${userId}`]) // Filter based on the user's ID
                ]
            );
            
            if (documents.total > 0) {
                return documents.documents[0].label;
            }

            return null; // No label found
        } catch (error) {
            console.error("Error fetching user label: ", error);
        }
    }
}

export const appwriteAuthService = new appwriteAuth();
