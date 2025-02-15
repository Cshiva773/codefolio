import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB=async () =>{
    try{
        await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log("Database connected")
        
    }catch(err){
        console.error("Error",err);
        process.exit(1)
    }
}
export default connectDB