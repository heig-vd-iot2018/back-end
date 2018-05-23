class Node {
  constructor(id, location, dateCreated, dateUpdated, active, sensors) {
    this.id = id;
    this.location = location;
    this.date_created = dateCreated;
    this.date_updated = dateUpdated;
    this.active = active;
    this.sensors = sensors;
  }
}

module.exports = Node;
