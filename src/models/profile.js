const db = require('../helpers/db')
const table = 'users'

exports.createProfile = (data, cb) => {
  db.query(`
  INSERT INTO ${table} (role ,name, email, password, phone_number) VALUES (?,?,?,?,?)
  `, [data.role, data.name, data.email, data.password, data.phone_number], cb)
}
exports.getProfile = (id, cb) => {
  db.query(`
  SELECT id, role, name, email, address, phone_number FROM ${table} WHERE id = ?
  `, [id], cb)
}
exports.updateProfile = (data, id, cb) => {
  db.query(`
  UPDATE ${table} SET  name=?, address=?, phone_number=? WHERE id=?
  `, [data.name, data.address, data.phone_number, id], cb)
}
exports.changeProfilePassword = (data, id, cb) => {
  db.query(`
  UPDATE ${table} SET password=? WHERE id=?
  `, [data.password, id], cb)
}
exports.updateProfilePartial = (data, cb) => {
  const key = Object.keys(data)
  const lastColumn = key[key.length - 1]
  db.query(`
  UPDATE ${table} SET ${lastColumn} = ?, updated_at=? WHERE id=?
  `, [data[lastColumn], data.updated_at, data.id], cb)
}
exports.deleteProfile = (id, cb) => {
  db.query(`
  DELETE FROM ${table} WHERE id=?
  `, [id], cb)
}
