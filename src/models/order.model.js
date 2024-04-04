const mongoose = require("mongoose");
const orderModel = new mongoose.Schema({
  articleList: Object,
  date: Date,
  clientCode: String,
  statusId: mongoose.Schema.ObjectId,
  restaurantId: mongoose.Schema.ObjectId,
  clientId: mongoose.Schema.ObjectId,
  deliverymanId: mongoose.Schema.ObjectId
});
const Order = mongoose.model('Order', orderModel);

module.exports = { Order };