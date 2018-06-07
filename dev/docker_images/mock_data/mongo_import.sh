#! /bin/bash

mongoimport --host database:27017 --db iot_back_end --collection Nodes --jsonArray --file mock_data/Nodes.json
mongoimport --host database:27017 --db iot_back_end --collection Data --jsonArray --file mock_data/Data.json
mongoimport --host database:27017 --db iot_back_end --collection Sensors --jsonArray --file mock_data/Sensors.json