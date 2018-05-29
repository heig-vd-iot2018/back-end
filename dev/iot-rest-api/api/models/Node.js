class Node {
  constructor(id, location, dateCreated, dateUpdated, active, sensors) {
    this.id = id;
    this.location = location;
    this.dateCreated = dateCreated;
    this.dateUpdated = dateUpdated;
    this.active = active;
    this.sensors = sensors;
  }
}

module.exports = Node;
