const mongoose = require('mongoose')

const serviceSchema=new mongoose.Schema({
    serviceName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location:{type:String},
    imageURL:{type:String}
})

const Service=mongoose.model('Service',serviceSchema);

module.exports=Service;