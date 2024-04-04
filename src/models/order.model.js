const mongoose = require("mongoose");
const orderModel = new mongoose.Schema({
  articleList: Object,
  date: Date,
  clientCode: Number,
  statusId: Object,
  restaurantId: Object,
  clientId: Object,
  deliverymanId: Object
});
const Order = mongoose.model('Order', orderModel);

module.exports = { Order };