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
          s.refreshInterval
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
        s.refreshInterval
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

function setDataTest(req, res) {
  const data = req.swagger.params.data.value;
  
  res.type('text/plain');
  res.status(200).send(data);

}

function setData(req, res) {
  const sensorData = req.swagger.params.data.value;

  // Check the length of the payload
  if (sensorData.payload.length % 4 !== 0) {
    res.status(400).json({ message: 'Bad payload format (Length is incorrect)' });
  }

  // Get the header in binary (Bits fields)
  const headers = sensorData.payload.substr(0, 4);
  const headersInBinary = parseInt(headers, 16).toString(2);

  const datas = [];
  let dataCount = 1;

  // Process all the data
  for (let i = 0; i < headersInBinary.length; i += 1) {
    const bit = parseInt(headersInBinary.charAt(i), 10);

    // If the field is not active
    if (bit !== 0) {
      // Get the specific field
      const bits = sensorData.payload.substr(dataCount * 4, 4);

      // If the field not exists
      if (bits === '') {
        res.status(400).json({ message: 'Bad payload format (Headers and fields are not matching)' });
      }

      let header;
      let value;

      // Map the bit field
      switch (i) {
        case 0:
          header = 'temperature';
          value = parseInt(bits, 16) / 10;
          break;
        case 1:
          header = 'pressure';
          value = parseInt(bits, 16) / 10;
          break;
        case 2:
          header = 'humidity';
          value = parseInt(bits, 16) / 100;
          break;
        case 3:
          header = 'gas resistance';
          value = parseInt(bits, 16) / 10;
          break;
        case 4:
          header = 'light';
          value = parseInt(bits, 16);
          break;
        case 14:
          header = 'die temperature';
          value = parseInt(bits, 16) / 10;
          break;
        case 15:
          header = 'battery voltage';
          value = parseInt(bits, 16) / 10;
          break;
        default:
          res.status(400).json({ message: 'Bad payload format (Use of non-used field)' });
      }

      dataCount += 1;

      const data = new Data(
        sensorData.id,
        new Date(),
        header,
        value,
      );

      datas.push(data);
    }
  }

  const { dataDAO } = database;

  dataDAO.saveAll(datas).then(() => {
    res.status(200).send();
  }, (err) => {
    res.status(500).json({ message: err.toString() });
  });
}


module.exports = {
  getSensors,
  getSensor,
  patchSensor,
  setData,
  setDataTest,
};
