const db = require('../helpers/db')

const table = 'chats'

exports.createChat = (data, cb) => {
  const datanew = db.query(`
  INSERT INTO ${table} (message, sender, recipient, isLatest)
  VALUES (?,?,?,?)
  `, [data.message, data.sender, data.recipient, data.isLatest = 1], cb)
  console.log(datanew)
}
exports.updateChat = (data, cb) => {
  const datanew = db.query(`
  UPDATE ${table} SET isLatest=0 WHERE sender in (?,?) and recipient in (?,?) and isLatest = 1
  `, [data.sender, data.recipient, data.recipient, data.sender], cb)
  console.log(datanew)
}
exports.checkPhone = (data, cb) => {
  db.query('SELECT * from users WHERE phone_number=?', [data.phone], cb)
}
exports.getAllChatRoom = (data, cb) => {
  db.query(`
  SELECT chats.id, chats.message, chats.sender, chats.recipient
  FROM chats
  WHERE chats.sender IN (?, ?) AND chats.recipient IN (?, ?)
  `, [data.sender, data.recipient, data.recipient, data.sender], cb)
}
exports.getUserChat = (data, cb) => {
  db.query(`
  SELECT users.id as id_users, chats.id, chats.message, chats.sender, chats.recipient, users.name, users.picture
  FROM chats LEFT JOIN users ON (chats.recipient = users.phone_number or chats.sender=users.phone_number)
  WHERE (chats.sender=? or chats.recipient=?)
  AND isLatest = 1
  `, [data.sender, data.recipient], cb)
}

exports.findUsers = (data, cb) => {
  db.query(`
  SELECT * FROM users WHERE users.${data.col} LIKE '%${data.search}%'
  `, cb)
}

exports.deleteChat = (id, cb) => {
  db.query(`
  DELETE FROM chats WHERE chats.id=?
  `, [id], cb)
}
