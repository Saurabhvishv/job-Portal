const Express = require('express');
var bodyParser = require('body-parser');
require ('./model/dbConnect')
const route = require('./route/route.js')

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route);

app.listen(process.env.PORT || 5000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 5000))
});