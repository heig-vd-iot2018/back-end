const SensorDTO = require('../dto/sensor/SensorDTO');
const database = require('../dao/database');

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
  console.log(req.swagger.params.id.value)
  const id = req.swagger.params.id.value;

  const { sensorDAO } = database;
  sensorDAO.findOne(id).then((s) => {
    if (s === null) {
      res.status(404).json({ message: 'Not found.' });
    } else {
      console.log(s)
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


module.exports = {
  getSensors,
  getSensor,
};
