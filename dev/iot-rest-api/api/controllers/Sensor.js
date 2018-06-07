const SensorDTO = require('../dto/sensor/SensorDTO');
const database = require('../dao/database');
const Data = require('../models/Data');

/*
  Functions in Sensor controllers used to get all sensors:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getSensors(req, res) {
  const { sensorDAO } = database;
  sensorDAO.findAll().then((sensors) => {
    if (sensors === null) {
      res.status(404).json({ message: 'Not found.' });
    } else {
      const sensorsList = [];

      sensors.forEach((s) => {
        sensorsList.push(new SensorDTO(
          s.id,
          s.documentationLink,
          s.dateCreated,
          s.dateUpdated,
          s.active,
          s.refreshInterval,
          s.encoding,
          s.values
        ));
      });

      res.json(sensorsList);
    }
  }, (err) => {
    res.status(500).json({ message: `An error occurred: ${err}` });
  });
}

function getSensor(req, res) {
  const id = req.swagger.params.id.value;

  const { sensorDAO } = database;
  sensorDAO.findOne(id).then((s) => {
    if (s === null) {
      res.status(404).json({ message: 'Not found.' });
    } else {
      res.status(200).json(new SensorDTO(
        s.id,
        s.documentationLink,
        s.dateCreated,
        s.dateUpdated,
        s.active,
        s.refreshInterval,
        s.encoding,
        s.values
      ));
    }
  }, (err) => {
    res.status(500).json({ message: `An error occurred: ${err}` });
  });
}

function patchSensor(req, res) {
  const id = req.swagger.params.id.value;
  const sensor = req.swagger.params.data.value;

  const { sensorDAO } = database;
  sensorDAO.updateOne(id, sensor).then((s) => {
    const { result } = s;

    if (result.ok === 1 && result.nModified === 1 && result.n === 1) {
      res.status(200).send();
    } else if (result.ok === 1 && result.nModified === 0 && result.n === 0) {
      res.status(404).json({ message: 'Not found.' });
    } else {
      // TODO: Maybe change the result
      res.status(200).send();
    }
  }, (err) => {
    res.status(500).json({ message: `An error occurred: ${err}` });
  });
}

function setData(req, res) {
  const sensorData = req.swagger.params.data.value;
  
  // TODO : Check the length of the header

  // Get the header (Bit field)
  const headers = sensorData.payload.substr(0, 4);

  // Convert to binary
  const headersInBits = parseInt(headers, 16).toString(2);
  
  let dataCount = 1;
  
  // Process all the data
  for(var i = 0; i < headersInBits.length; i++) {
    const bit = parseInt(headersInBits.charAt(i));

    if(bit === 0) continue;
  
    let header;
    let value;
  
    // Get the specific bits
    const bits = sensorData.payload.substr(dataCount * 4, 4);

    switch(i) {
      case 0:
        header = "temperature";
        value = parseInt(bits, 16) / 10;
        break;
      case 1:
        header = "pressure";
        value = parseInt(bits, 16) / 10;
        break;
      case 2:
        header = "humidity";
        value = parseInt(bits, 16) / 100;
        break;
      case 3:
        header = "gas resistance";
        value = parseInt(bits, 16) / 10;
        break;
      case 4:
        header = "light";
        value = parseInt(bits, 16);
      case 14:
        header = "die temperature";
        value = parseInt(bits, 16) / 10;
        break;
      case 15:
        header = "battery voltage";
        value = parseInt(bits, 16) / 10;
        break;
    }

    dataCount += 1;

    const data = new Data(
      sensorData.id,
      new Date(),
      header,
      value,
    );
 
    const { dataDAO } = database;
 
    dataDAO.save(data).then((m) => {
    }, (err) => {
      res.status(500).json({ message: err.toString() });
    });
  }

  res.status(200).send();
}


module.exports = {
  getSensors,
  getSensor,
  patchSensor,
  setData,
};
