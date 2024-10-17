import {Client,Databases,Query,Storage,ID} from 'appwrite'
import conf from '../config/conf'

class postOperation{
    client
    account
    database
    storage

    constructor(){
        this.client = new Client()
        this.client.setEndpoint(conf.appwriteUrl)
        this.client.setProject(conf.appwriteProjectId)
        this.database = new Databases(this.client)
        this.storage = new Storage(this.client)
    }

    async createBlog({title,slug,content,featuredImage,status,userId}){
        try {
            return await this.database.createDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    async editBlog(slug,{title,content,featuredImage,status}){
        try {
            return await this.database.updateDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    async deleteBlog(slug){
        try {
            await this.database.deleteDocument(
                conf.databaseId,
                conf.collectionId,
                slug
            )
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }
    async getDocuments(queries){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async getBlog(slug){
        
        try {
            return await this.database.getDocument(
                conf.databaseId,
                conf.collectionId,
                slug
            )
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async uploadfile(file){
        try {
            return await this.storage.createFile(
                conf.bucketId,
                ID.unique(),
                file,
            )
            
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                conf.bucketId,
                fileId
            )
            return true            
        } catch (error) {
            console.error(error);
            return false
        }
    }

    getFilePreview(fileId,width,height){
        try {
            return this.storage.getFilePreview(
                conf.bucketId,
                fileId,
                width,
                height,
            )
        } catch (error) {
            console.error(error);
        }
    }
}

export const blogOperations = new postOperation()