const express = require('express');

const router = express.Router();
const jobController = require('../controller/jobController');
const userController = require('../controller/userController');
const middleware = require('../middleware/middleware')

router.post('/register', userController.registeruser);
router.post('/login', userController.loginuser);
router.get('/fetch', userController.getuser);
router.get('/fetch/:userId', middleware.userAuth,userController.getuserById);
router.post('/update/:userId', middleware.userAuth,userController.updateuser);
router.delete('/delete/:userId', middleware.userAuth,userController.deleteuser);
router.get('/registerjob', jobController.registerjob);
router.get('/jobDetails', jobController.jobDetails);

module.exports = router;