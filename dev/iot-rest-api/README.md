# IOT back-end REST API

This folder contains the IOT back-end REST API Swagger/Node project. It was made using the [swagger-node module](https://github.com/swagger-api/swagger-node).

## Installation

To install the swagger-node globally:

```
npm install -g swagger
```

### Add a .env file

In order to run the project locally and connect to the database running in a Docker container, you will have to create a `.env` file in this folder and copy the content of the [`.env_example`](./.env_example) file in it. Adjust the DB_ADRESS if needed for it to work with your Docker installation. 

## Run the project in development mode

To run the project in development mode, you can use one of the following commands in a terminal (the second one, "mock mode" is useful to test the API in the Swagger editor without having to implement the REST API controllers).

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