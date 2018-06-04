# IOT back-end REST API

This folder contains the IOT back-end REST API Swagger/Node project. It was made using the [swagger-node module](https://github.com/swagger-api/swagger-node).

## Installation

To install the swagger-node globally:

```
npm install -g swagger
```

### Add a .env file

In order to run the project locally and connect to the database running in a Docker container, you will have to create a `.env` file in this folder and copy the content of the [`.env_example`](./.env_example) file in it. Adjust the `DB_ADDRESS` variable if needed for it to work with your Docker installation. 

## Run the project in development mode

To run the project in development mode, you can use one of the following commands in a terminal (the second one - "mock mode" - is useful to test the API in the Swagger editor without having to implement the REST API controllers).

```
swagger project start
```
or 

```
swagger project start -m
```

## Swagger editor

In another terminal, you can now run this command to open the Swagger editor in your browser:

```
swagger project edit
```

The REST API is available on the port 10010 on `localhost:10010`

## Generate a markdown of the Swagger file

To generate the swagger documentation to markdown, you can use:

```
npm run md-docs
```

This will create `api/swagger/swagger.md` file. You can visit this [page](./api/swagger/swagger.md) to display the endpoints.

## Authentication and Authorization

This section should be tested, but it should work.

To authenticate a user, a middleware `swaggerSecurityHandler` has been defined. Its responsability is to verify that the `Authorization` header exists and contains a valid JWT. If it is valid, it will add the decoded JWT in a custom field in the request. You should then be able to access it in the endpoint controllers using:

```javascript
const currentUserToken = req.custom.currentUserToken;
```

where `req` is the express request object.

To manage authorization, simply test the `role` property of that decoded JWT in your endpoint controller. It can be default or admin value. 

```javascript
const roles = require('../../../api/helpers/roles'); // might want to correct the path

function myEndpointController(req, res) {
	const currentUserToken = req.custom.currentUserToken;

	if (currentUserToken.role === roles.ADMIN) { // Admin is an integer constant (1)
		// Authorize
	} else {
		// Refuse
	}
}
```

