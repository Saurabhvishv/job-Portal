const mongoose = require('mongoose')


const jobSchema = new mongoose.Schema({
    companyname: String,
    designation: String,
    description: String,
    address: String,
    vacancy: Number,
    salary: Number,
    startdate: { type: Date },
    updated_date: { type: Date, default: Date.now },
}, { timestamps: true })
module.exports = mongoose.model('job', jobSchema)