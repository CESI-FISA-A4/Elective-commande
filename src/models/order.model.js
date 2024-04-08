const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  articleList: [{ type: mongoose.Schema.ObjectId, ref:"Article"}],
  date: { type:String, default: Date},
  clientCode: String,
  status: { type: mongoose.Schema.ObjectId, ref:"Status"},
  restaurantId: mongoose.Schema.ObjectId,
  clientId: Number,
  deliverymanId: Number
});
const Order = mongoose.model('Order', orderModel);

module.exports = { Order };