# Node image
FROM node:9.8.0

COPY ["/iot-rest-api/package.json", "/opt/app/package.json"]

WORKDIR /opt/app/
RUN npm install

COPY ["/iot-rest-api/app.js", "/opt/app/"]
COPY ["/iot-rest-api/api/", "/opt/app/api/"]
COPY ["/iot-rest-api/config/", "/opt/app/config/"]
COPY ["/docker_images/rest_api/.env_docker", "/opt/app/.env"]

CMD [ "npm", "start" ]
