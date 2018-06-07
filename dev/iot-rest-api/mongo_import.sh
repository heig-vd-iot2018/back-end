#! /bin/bash

while IFS='=' read param val
do
    eval "$param"="$val"
done <'.env'

echo $DB_ADDRESS
echo $DB_PORT
echo $DB_NAME

mongoimport --host $DB_ADDRESS:$DB_PORT --db $DB_NAME --collection Nodes --jsonArray --file mock_data/Nodes.json
mongoimport --host $DB_ADDRESS:$DB_PORT --db $DB_NAME --collection Data --jsonArray --file mock_data/Data.json
mongoimport --host $DB_ADDRESS:$DB_PORT --db $DB_NAME --collection Sensors --jsonArray --file mock_data/Sensors.json