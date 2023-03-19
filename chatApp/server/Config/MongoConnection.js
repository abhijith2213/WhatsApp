const mongoose = require('mongoose')
const uri = process.env.MONGO_URL


const connectDb = async ()=>{
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {connectDb}