#! /bin/bash

mongoimport --host database:27017 --db iot_back_end --collection nodes --jsonArray --file mock_data/Nodes.json
mongoimport --host database:27017 --db iot_back_end --collection data --jsonArray --file mock_data/Data.json
mongoimport --host database:27017 --db iot_back_end --collection sensors --jsonArray --file mock_data/Sensors.json