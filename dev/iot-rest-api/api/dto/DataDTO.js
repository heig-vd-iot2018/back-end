class DataDTO {
  constructor(
    sensorId,
    type,
    date,
    value
  ) {
    this.sensorId = sensorId;
    this.type = type;
    this.date = date;
    this.value = value;
  }
}
module.exports = DataDTO;
