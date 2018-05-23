class User {
  constructor(username, password, date_created, date_updated) {
    this.username = username;
    this.password = password;
    this.date_created = date_created;
    this.date_updated = date_updated;
  }
}

module.exports = User;
