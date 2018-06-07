# Use the official mongo image
FROM mongo:3.7.9

COPY docker_images/mock_data/mongo_import.sh /tmp/
COPY docker_images/mock_data/mock_data /tmp/mock_data/

WORKDIR /tmp/

CMD sh mongo_import.sh