class SensorDTO {
  constructor(
    id,
    documentationLink,
    dateCreated,
    dateUpdated,
    active,
    refreshInterval,
    encoding,
    values
  ) {
    this.id = id;
    this.documentationLink = documentationLink;
    this.dateCreated = dateCreated;
    this.dateUpdated = dateUpdated;
    this.active = active;
    this.refreshInterval = refreshInterval;
    this.encoding = encoding;
    this.values = values;
  }
}

module.exports = SensorDTO;
