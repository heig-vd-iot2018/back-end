'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var mongoose = require('mongoose');


/* Message schema */
var messageSchema = mongoose.Schema({
	message: String,
	name: String
});
var Message = mongoose.model('Message', messageSchema);

const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_PORT = process.env.DB_PORT;

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  getMessage,
	postMessage
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getMessage(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value;

	mongoose.connect('mongodb://' + DB_ADDRESS + ':' + DB_PORT + '/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		var query  = Message.where({ name: name });
		query.findOne(function (err, message) {
			if (err) return handleError(err);
			if (message) {
			  res.json({message:message.message, name:message.name});
			} else {
				res.status(404).json({message: 'Not found.'})
			}
		});
	});
}

function postMessage(req, res) {

	const requestMessage = req.body;

	mongoose.connect('mongodb://' + DB_ADDRESS + ':' + DB_PORT + '/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {

		var m = new Message({ message:  requestMessage.message, name: requestMessage.name });
		m.save(function (err, message) {
	    if (err) return console.error(err);

		  // this sends back a JSON response which is a single string
		  res.status(201).end();
	  });
	});
}
