const mongoose = require("mongoose");
const restaurantModel = new mongoose.Schema({
  name: String,
  address: String,
  acceptTicket: Boolean,
  description: String,
  imgUrl: String,
  restaurantOwnerId: Number
});
const Restaurant = mongoose.model('Restaurant', restaurantModel);

module.exports = { Restaurant };