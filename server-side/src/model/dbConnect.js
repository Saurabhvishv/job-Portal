const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/jobApply?retryWrites=true&w=majority")

    .then(() => console.log('mongodb running on 27017'))
    
    .catch(err => console.log(err))
