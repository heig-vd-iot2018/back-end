'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

const Node = require('../models/Node');
// const NodeDTO = require('../dto/message/NodeDTO');
const database = require('../dao/database');

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getNodes(req, res) {
  // const name = req.swagger.params.name.value;

  console.log('HELLO IM In getNodes');
  /*
  const node1 = new Node(1, 'aula', 'date1', 'date2', true, [2, 4, 6, 7]);
  const node2 = new Node(2, 'plage', 'date3', 'date4', true, [1, 14, 23, 24]);
  console.log('Node created');
  res.status(200).json([node1, node2]);
  */

  const { nodeDAO } = database;
  nodeDAO.findAll().then((nodes) => {
    console.log(nodes);
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

function postNode(req, res) {
  console.log(req.swagger.params.node);
  const node = new Node(
    req.swagger.params.node.value.id,
    req.swagger.params.node.value.createdDate,
    req.swagger.params.node.value.lastUpdated,
    req.swagger.params.node.value.active,
    req.swagger.params.node.value.localisation,
    req.swagger.params.node.value.sensors,
  );
  console.log(node);

  const { nodeDAO } = database;

  // const node = new Node(1, 'aula', 'date1', 'date2', true, [2, 4, 6, 7]);

  nodeDAO.saveOne(node).then((m) => {
    res.status(201).json([node]);
  }, (err) => {
    res.status(500).json({ message: err.toString() });
  });
}

module.exports = {
  getNodes,
  postNode,
};
