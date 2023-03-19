const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required!']
    },
    phone:{
        type:String,
        required:[true,'Phone is required!']
    },
    profile:{
        type:String,
        default:'profile.png'
    },
    password:{
        type:String,
        required:[true,'Password is required!']
    },
    online:{
        type:Number
    }
},{timestamps:true})

const UserSchema = mongoose.model('users',userSchema);
module.exports = UserSchema;