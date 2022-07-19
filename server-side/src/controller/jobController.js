const mongoose = require('mongoose')
const jobModel = require('../model/jobModel.js')
const userModel = require('../model/userModel.js')
const middleware = require('../middleware/middleware.js')

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true;
}

//  API 1 Register job
const registerjob = async function (req, res) {

    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, Message: "please provide job details in body" })
        }

        let { companyname, designation, description, address, vacancy, salary, startdate } = requestBody //destructuring

        if (!isValid(companyname)) {
            return res.status(400).send({ status: false, Message: "Please provide companyname" })
        }

        if (!isValid(designation)) {
            return res.status(400).send({ status: false, Message: "Please provide designation" })
        }

        if (!isValid(description)) {
            return res.status(400).send({ status: false, Message: "Please provide description" })
        }

        if (!isValid(address)) {
            return res.status(400).send({ status: false, Message: "Please provide address" })
        }

        if (!isValid(vacancy)) {
            return res.status(400).send({ status: false, Message: "Please provide vacancy" })
        }

        if (!isValid(salary)) {
            return res.status(400).send({ status: false, Message: "Please provide salary" })
        }

        if (!isValid(startdate)) {
            return res.status(400).send({ status: false, Message: "Please provide startdate" })
        }

        const jobData = { companyname, designation, description, address, vacancy, salary, startdate }
        const createjob = await jobModel.create(jobData)
        return res.status(201).send({ status: true, Message: "job registered successfully", data: createjob })
    } catch (error) {
        return res.status(500).send({ status: false, Message: error.message })
    }
}

const jobDetails = async function (req, res) {
    try {
        //validation starts

        const query1 = req.query
        if (!isValidRequestBody(query1)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide job name' })

        }
        const jobNames = req.query.companyname
        if (!isValid(companyname, "string")) {
            return res.status(400).send({ status: false, message: 'Not a valid name' })
        }


        const jobdetail = await jobModel.findOne({ name: companyname, isDeleted: false })
        if (!jobdetail) {
            return res.status(400).send({ status: false, message: 'No job found with this name' })

        }

        //console.log(jobdetail)
        const ID = jobdetail._id
        const users = await userModel.find({ jobId: ID, isDeleted: false }).select({ name: 1, email: 1 })
        if (users.length === 0) {
            let arr = {
                companyname: jobdetail.companyname,
                designation: jobdetail.designation,
                description: jobdetail.description,
                vacancy: jobdetail.vacancy,
                address: jobdetail.address,
                salary: jobdetail.salary,
                users: "No one apllied in this job"
            }
            return res.status(200).send({ status: true, data: arr })
        } else {
            let arr = {
                companyname: jobdetail.companyname,
                designation: jobdetail.designation,
                description: jobdetail.description,
                vacancy: jobdetail.vacancy,
                address: jobdetail.address,
                salary: jobdetail.salary,
                users: users
            }


            res.status(200).send({ status: true, data: arr })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports = { registerjob, jobDetails }