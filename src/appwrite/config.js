import {Client,Databases,Query,Storage,ID} from 'appwrite'
import conf from '../config/conf'

class documentOperation{
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

    async updateRentalInfo(collectionId, slug, {
        renterName,
        renterContact,
        rentStartDate,
        rentEndDate,
        monthlyRent,
        paymentDueDate,
        securityPaid,
        totalAmountPaid,
        paymentStatus,
        EntryOperator,
        wallet
}) {
  try {
    // Call to Appwrite API to update the document
    const updatedDocument = await this.database.updateDocument(
      conf.appwriteDatabaseId,
      collectionId,
      slug,
      {
        renterName,
        renterContact,
        rentStartDate,
        rentEndDate,
        monthlyRent,
        paymentDueDate,
        securityPaid,
        totalAmountPaid,
        paymentStatus,
        EntryOperator,
        wallet
      }
    );
    
    return updatedDocument; // Return the updated document after success

  } catch (error) {
    console.error('Error updating rental info:', error);
    return { success: false, message: error.message }; // Return error information if needed
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
    async getDocuments(collectionId,queries){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                collectionId,
                queries
            )
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async getDocument(collectionId,slug){
        
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseId,
                collectionId,
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

export const documentOperations = new documentOperation()