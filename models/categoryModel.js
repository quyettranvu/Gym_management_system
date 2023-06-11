import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true,
        unique:true
    }
},{
    timestamps:true
});

export default mongoose.model("category",categorySchema);