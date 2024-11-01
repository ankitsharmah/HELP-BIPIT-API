import mongoose from 'mongoose';

const connectDb =async ()=>{
    console.log("in connecting")
    await mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("db connected")
    }).catch(()=>{
        console.log("error in connecting")
    })
}

export default connectDb;