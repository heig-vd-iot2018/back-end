class Node {
  constructor(id, createdDate, lastUpdated, active, localisation, sensors) {
    this.id = id;
    this.createdDate = createdDate;
    this.lastUpdated = lastUpdated;
    this.active = active;
    this.localisation = localisation;
    this.sensors = sensors;
  }
}

module.exports = Node;
