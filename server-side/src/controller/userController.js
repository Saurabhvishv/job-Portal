const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const userModel = require('../model/userModel.js')
const middleware = require('../middleware/middleware.js')
const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidPassword = function (password) {
    if (password.length > 7 && password.length < 16)
        return true
}

//  API 1 Register user
const registeruser = async function (req, res) {

    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, Message: "please provide user details in body" })
        }

        let { name, email, password } = requestBody //destructuring

        if (!isValid(name)) {
            return res.status(400).send({ status: false, Message: "Please provide name" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, Message: "Please provide email" })
        }

        let Email = email.split(" ").join('')

        const isEmailAlready = await userModel.findOne({ email: Email })

        if (isEmailAlready) {
            return res.status(400).send({ status: false, Message: `${Email} is already used` })
        }
        if (!((emailRegex).test(Email))) {
            return res.status(400).send({ status: false, Message: "email is not valid, write in correct format" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, Message: "Please provide password" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, Message: "length of password should be 8-15 char." })
        }

        const encryptedPass = await bcrypt.hash(password, 10)
        const userData = { name, email, password: encryptedPass }
        const createuser = await userModel.create(userData)
        return res.status(201).send({ status: true, Message: "user registered successfully", data: createuser })
    } catch (error) {
        return res.status(500).send({ status: false, Message: error.message })
    }
}

// API 2 Login user
const loginuser = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, Message: "Please provide login credentials" })
        }

        const { email, password } = requestBody; //destructuring

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` })

        }

        if (!((emailRegex).test(email))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` })

        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ status: false, Message: `No user found with ${email}` })
        }

        const matchPassword = await bcrypt.compareSync(password, user.password) //matching original and encrypted

        if (!matchPassword) {
            return res.status(401).send({ status: false, message: 'Password Incorrect' })
        }

        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
        }, 'crud')

        return res.status(200).send({ status: true, message: `user login successfull`, data: { token, userId: user._id } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// API 3.1 get all users Details
const getuser = async function (req, res) {
    try {

        const user = await userModel.find()

        return res.status(200).send({ status: true, Message: "Details fetch successfully", data: user })

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message });
    }
}

// API 3.2 get all users Details by Id
const getuserById = async function (req, res) {
    try {
        const userId = req.params.userId
        const tokenId = req.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, Message: "Please provide valid user id" })
        }
        if (userId == tokenId) {
            const user = await userModel.findOne({ _id: userId, isDeleted: false })
            if (!(user)) {
                return res.status(404).send({ status: false, msg: "No user found with this Id" })
            }
        return res.status(200).send({ status: true, Message: "Details fetch successfully", data: user })
        } else {
            return res.status(401).send({ status: false, Message: "You are not authorized to fetch details of this user!!!" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// API 4 update empoyee details
const updateuser = async function(req, res) {

    try {
        const userId = req.params.userId;
        const requestBody = req.body;
        const decodedId = req.userId;

        if (userId == decodedId) {
            if (!isValidRequestBody(requestBody)) {
                return res.status(200).send({ Message: "No data updated, details are unchanged" })
            }
            
            let { name, email } = requestBody //destructuring

            const userFind = await userModel.findById(userId)

            if (name) {
                if (!isValid(name)) {
                    res.status(400).send({ status: false, Message: "Provide a valid name" })
                }
                userFind['name'] = name
            }

            if (email) {
                if (!(emailRegex).test(email)) {
                    return res.status(400).send({ status: false, message: " Provide a valid email address" })
                }
                const isEmailAlreadyUsed = await userModel.findOne({ email: email });
                if (isEmailAlreadyUsed) {
                    return res.status(400).send({ status: false, message: `${email} email address is already registered` })
                }
                userFind['email'] = email
            }

            const updatedData = await userFind.save()
            return res.status(200).send({ status: true, Message: "Data Updated Successfully", data: updatedData })
        } else {
            res.status(401).send({ status: false, Message: "You are not authorzied to update this user profile" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// API 5 delete empoyee 
const deleteuser = async function(req, res) {
    try {
        const userId = req.params.userId;
        const decodedId = req.userId;

        if (userId == decodedId) {
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, Message: "Please provide valid user id" })
        }
        const user = await userModel.findOne({ _id: userId, isDeleted: false, admin: false })
        if (!(user)) {
            return res.status(404).send({ status: false, msg: "No user found with this Id" })
        }
        const deletedData = await userModel.findOneAndUpdate({ _id: userId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        return res.status(200).send({ status: true, msg: "user Deleted", data: deletedData })
    } else {
        res.status(401).send({ status: false, Message: "You are not authorzied to update this user profile" })
    }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { registeruser, loginuser, getuser, getuserById, updateuser, deleteuser }