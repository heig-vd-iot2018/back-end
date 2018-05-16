const mongoose = require('mongoose');

/* Message schema */
const messageSchema = mongoose.Schema({
  message: String,
  name: String,
});
const Message = mongoose.model('Message', messageSchema);

class MessageDAO {
  constructor(settings) {
    if (settings === undefined) {
      throw new Error('Missing argument settings.');
    } else if (settings.dbAddress === undefined || settings.dbPort === undefined) {
      throw new Error('Missing settings property.');
    }

    this.settings = settings;
  }

  findOne(name, onSuccess, onError) {
    mongoose.connect(`mongodb://${this.settings.dbAddress}:${this.settings.dbPort}/test`);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      const query = Message.where({ name });
      query.findOne((err, message) => {
        if (err) onError(err);
        if (message) {
          onSuccess(message);
        } else {
          onError();
        }
      });
    });
  }

  saveOne(message, onSuccess, onError) {
    mongoose.connect(`mongodb://${this.settings.dbAddress}:${this.settings.dbPort}/test`);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      const m = new Message({ message: message.message, name: message.name });
      m.save((err, createdMessage) => {
        if (err) onError(err);
        else onSuccess(createdMessage);
      });
    });
  }
}

module.exports = MessageDAO;
