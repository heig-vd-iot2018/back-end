# IOT Backend development

The back-end is composed of a REST API (made using Swagger and Node.js) and a database using MongoDB.

## Docker environment

To run the back-end project in a Docker environment, run the following command:

```
docker-compose up --build
```

Be careful, this command will also import the example data. To run the project without the example data run the following command:

```
docker-compose up --build database restapi
```

The REST API will be available on the port 4000 on `localhost:4000`

## Database

To run only the database service: 

```
docker-compose up --build database
```

To run the database service with example data:
```
docker-compose up --build database mongo-data
```

## REST API

Please refer to the corresponding [documentation](./iot-rest-api/README.md) to learn more about the REST API project.

