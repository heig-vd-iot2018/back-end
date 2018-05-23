class Sensor {
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
    this.documentation_link = documentationLink;
    this.date_created = dateCreated;
    this.date_updated = dateUpdated;
    this.active = active;
    this.refresh_interval = refreshInterval;
    this.encoding = encoding;
    this.values = values;
  }
}

module.exports = Sensor;
