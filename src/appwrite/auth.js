import {Client,Account,ID} from 'appwrite';
import conf from '../config/conf'
class appwriteAuth{
    client
    account
    
    constructor(){
        this.client = new Client()
        this.client.setEndpoint(conf.appwriteUrl)
        this.client.setProject(conf.appwriteProjectId)
        this.account=new Account(this.client)
        
    }
    async signUp({email,password}){
        try{
            const userAccount =  await this.account.create(
                ID.unique(),
                email,
                password,
            )
            if(userAccount){
                this.login({email,password})
                return userAccount
            }
            else{
                return userAccount
            }
        }
        catch(error){
            console.error(error);
        }
    }
    async login({email,password}){
        try{
            return await this.account.createEmailPasswordSession(
                email,
                password
            )
        }catch(error){
            console.error(error);
        }
    } 
    async checkCurrentUserStatus(){
        try {
            return await this.account.get() 
        } catch (error) {
            return false
        }
    }
    async logout(){
        try {
            await this.account.deleteSessions()
        } catch (error) {
            console.error(error)
        }
    }
}

export const appwriteAuthService = new appwriteAuth()