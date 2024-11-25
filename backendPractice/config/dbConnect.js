const mongoose = require('mongoose')

const connect =()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/blogpractice')
        console.log("Connected to database")
    }
    catch(err){
        console.log(err)
    }
}
module.exports ={connect}