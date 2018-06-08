class NodeDTO {
  constructor(
    id,
    dateCreated,
    dateUpdated,
    active,
    latitude,
    longitude,
    sensors
  ) {
    this.id = id;
    this.dateCreated = new Date(dateCreated).toISOString();
    this.dateUpdated = new Date(dateUpdated).toISOString();
    this.active = active;
    this.latitude = latitude;
    this.longitude = longitude;
    this.sensors = sensors;
  }
}

module.exports = NodeDTO;

