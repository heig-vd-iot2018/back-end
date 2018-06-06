class Node {
  constructor(id, createdDate, lastUpdated, active, latitude, longitude, sensors) {
    this.id = id;
    this.createdDate = createdDate;
    this.lastUpdated = lastUpdated;
    this.active = active;
    this.latitude = latitude;
    this.longitude = longitude;
    this.sensors = sensors;
  }
}

module.exports = Node;
