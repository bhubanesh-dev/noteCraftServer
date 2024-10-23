
const mongoose=require('mongoose');

const Db= process.env.DATABASE;
// Check if MONGODB_URI is defined
if (!Db) {
    console.error("Error: MONGODB_URI is not defined in the environment variables.");
    process.exit(1); // Exit if not defined
}

mongoose.connect(Db).then(()=>{
    console.log("Database Connected");
}).catch((err)=>console.log("connection failed", err))