const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  articleIdList: [mongoose.Schema.ObjectId],
  date: Date,
  clientCode: String,
  statusId: mongoose.Schema.ObjectId,
  restaurantId: mongoose.Schema.ObjectId,
  clientId: Number,
  deliverymanId: Number
});
const Order = mongoose.model('Order', orderModel);

module.exports = { Order };