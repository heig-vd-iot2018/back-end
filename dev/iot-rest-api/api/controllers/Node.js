'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

const Node = require('../models/Node');
// const NodeDTO = require('../dto/message/NodeDTO');
const database = require('../dao/database');


function getNodes(req, res) {
  const { nodeDAO } = database;
  nodeDAO.findAll().then((nodes) => {
    if (nodes === null) {
      res.status(404).json({ message: 'Not found.' });
    } else {
      const nodesList = [];

      nodes.forEach((n) => {
        nodesList.push(n);
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
  nodeDAO.findById(id).then((node) => {
    console.log(node);
    if (node === null) {
      res.status(404).json({ message: 'No node found for that id.' });
    } else {
      res.status(200).json(node);
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
