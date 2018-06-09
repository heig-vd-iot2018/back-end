class SensorDTO {
  constructor(
    id,
    documentationLink,
    dateCreated,
    dateUpdated,
    active,
    refreshInterval
  ) {
    this.id = id;
    this.documentationLink = documentationLink;
    this.dateCreated = dateCreated;
    this.dateUpdated = dateUpdated;
    this.active = active;
    this.refreshInterval = refreshInterval;
  }
}

module.exports = SensorDTO;
