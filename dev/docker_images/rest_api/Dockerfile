# Node image
FROM node:9.8.0

COPY ["/iot-rest-api/package.json", "/opt/app/package.json"]

WORKDIR /opt/app/
RUN npm install

COPY ["/iot-rest-api/app.js", "/opt/app/"]
COPY ["/iot-rest-api/api/", "/opt/app/api/"]
COPY ["/iot-rest-api/config/", "/opt/app/config/"]

CMD [ "npm", "start" ]
