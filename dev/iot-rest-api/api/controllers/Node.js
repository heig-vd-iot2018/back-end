'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

const Node = require('../models/Node');
const DataDTO = require('../dto/DataDTO');
const NodeDTO = require('../dto/node/NodeWithDataDTO');
const database = require('../dao/database');


function getNodes(req, res) {
  const { nodeDAO } = database;
  nodeDAO.findAll().then((nodes) => {
    if (nodes === null) {
      res.status(404).json({ message: 'Not found.' });
    } else {
      const nodesList = [];

      nodes.forEach((node) => {
        const tmp = new NodeDTO(
          node.id,
          node.createdDate,
          node.lastUpdated,
          node.active,
          node.latitude,
          node.longitude,
          node.sensors
        );
        nodesList.push(tmp);
      });

      res.json(nodesList);
    }
  }, (err) => {
    res.status(500).json({ message: `An error occurred: ${err}` });
  });
}

function getNode(req, res) {
  const id = req.swagger.params.id.value;

  const { nodeDAO } = database;
  const { dataDAO } = database;

  nodeDAO.findById(id).then((node) => {
    if (node === null) {
      res.status(404).json({ message: 'No node found for that id.' });
    } else {
      const nodeDTO = {
        id: node.id,
        createdDate: new Date(node.createdDate).toISOString(),
        lastUpdated: new Date(node.lastUpdated).toISOString(),
        active: node.active,
        latitude: node.latitude,
        longitude: node.longitude,
        sensors: node.sensors,
        data: [],
      };
      let sensorsFetched = 0;

      node.sensors.forEach((sensorId) => {
        dataDAO.findBySensorId(sensorId).then((data) => {
          data.forEach((d) => {
            nodeDTO.data.push(new DataDTO(
              d.sensorId,
              d.type,
              new Date(d.date).toISOString(),
              d.value
            ));
          });

          sensorsFetched += 1;
          if (sensorsFetched === node.sensors.length) {
            res.status(200).json(nodeDTO);
          }
        }, (err) => {
          res.status(500).json({ message: `An error occurred: ${err}` });
        });
      });
    }
  }, (err) => {
    res.status(500).json({ message: `An error occurred: ${err}` });
  });
}

function postNode(req, res) {
  const node = new Node(
    req.swagger.params.node.value.id,
    req.swagger.params.node.value.createdDate,
    req.swagger.params.node.value.lastUpdated,
    req.swagger.params.node.value.active,
    req.swagger.params.node.value.latitude,
    req.swagger.params.node.value.longitude,
    req.swagger.params.node.value.sensors,
  );

  const { nodeDAO } = database;

  nodeDAO.saveOne(node).then((m) => {
    res.status(201).json([node]);
  }, (err) => {
    res.status(500).json({ message: err.toString() });
  });
}

module.exports = {
  getNodes,
  getNode,
  postNode,
};
