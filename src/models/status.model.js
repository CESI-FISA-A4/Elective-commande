const mongoose = require("mongoose");
const statusModel = new mongoose.Schema({
  state: String,
});
const Status = mongoose.model('Status', statusModel);

module.exports = { Status };