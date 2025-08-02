const mongoose = require('mongoose')
const {Schema}=require('mongoose');

const availabilitySchema=new mongoose.Schema({
    business:{
        type:Schema.Types.ObjectId,
        ref:'User',
        unique:true
    },
    workingDays:[String],
    holidays:[Date]
})

const availability=mongoose.model('availability',availabilitySchema);

module.exports=availability;