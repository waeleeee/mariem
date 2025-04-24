const User = require('./User');
const Chat = require('./Chat');
const MessageModel = require('./Message');

// Define associations
User.belongsToMany(Chat, { through: 'UserChats' });
Chat.belongsToMany(User, { through: 'UserChats' });

Chat.hasMany(MessageModel);
MessageModel.belongsTo(Chat);

User.hasMany(MessageModel);
MessageModel.belongsTo(User);

module.exports = {
  User,
  Chat,
  Message: MessageModel
};