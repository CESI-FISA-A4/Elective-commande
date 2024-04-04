const { mongoose, isValidObjectId } = require("mongoose");
const { Order } = require("../models/order.model");
const secretKey = process.env.JWT_SIGN_SECRET;

const errors = {
  invalidId: (() => {
    const err = Error("Invalid Id format");
    err.statusCode = 400;
    return err;
  })(),
  missingRequiredParams: (() => {
    const err = Error("Not all required parameters filled");
    err.statusCode = 400;
    return err;
  })(),
}

function formatResponseToRole(rolelabel) {
  switch (decoded.roleLabel) {
    case user:
      return {};
    case admin:
      return {};
    case deleveryman:
      return { clientCode: 0 };
    case restaurantOwner:
      return { clientCode: 0 };
    case salesman:
      return { clientCode: 0 };
    case technician:
      return {};
    case developer:
      return {};
    default:
      return {};
  }
}
module.exports = {
  getOrderbyId: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;
    const { userId, roleLabel } = req.query;
    const format = formatResponseToRole(roleLabel);

    const orders = await Order.findById(id, format);
    return orders;
  },
  getOrderbyClientId: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;
    const { userId, roleLabel } = req.query;
    const format = formatResponseToRole(roleLabel);

    const orders = await Order.find({ clientId: { $eq: id } }, format);
    return orders;
  },
  getOrderbyRestaurantId: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;
    const { userId, roleLabel } = req.query;
    const format = formatResponseToRole(roleLabel);

    const orders = await Order.find({ restaurantId: { $eq: id } }, format);
    return orders;
  },
  getOrderbyDeliverymanId: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;
    const { userId, roleLabel } = req.query;
    const format = formatResponseToRole(roleLabel);

    const orders = await Order.find({ deliverymanId: { $eq: id } }, format);
    return orders;
  },
  getOrders: async (req, res) => {
    const { userId, roleLabel } = req.query;
    const format = formatResponseToRole(roleLabel);
    const allOrders = await Order.find({}, format);
    return allOrders;
  },
  patchOrder: async (req, res) => {
    const { id } = req.params;
    const { date, clientCode, statusId, restaurantId, clientId, deliverymanId } = req.body;

    if (!isValidObjectId(id)) return errors.invalidId;
    if (!(date || clientCode || statusId || restaurantId || clientId || deliverymanId)) return errors.missingRequiredParams;

    await Order.findByIdAndUpdate(id, { date, clientCode, statusId, restaurantId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  putOrder: async (req, res) => {
    const { id } = req.params;
    const { date, clientCode, statusId, restaurantId, clientId, deliverymanId } = req.body;

    if (!isValidObjectId(id)) return errors.invalidId;
    if (!date || !clientCode || !statusId || !restaurantId || !clientId || !deliverymanId) return errors.missingRequiredParams;

    await Order.findByIdAndUpdate(id, { date, clientCode, statusId, restaurantId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  deleteOrder: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;

    await Order.findByIdAndDelete(id)
    return 'Order deleted successfully';
  },
  createOrder: async (req, res) => {
    const { date, clientCode, statusId, restaurantId, clientId, deliverymanId } = req.body;

    if (!date || !clientCode || !statusId || !restaurantId || !clientId) return errors.missingRequiredParams;

    Order.create({ date, clientCode, statusId, restaurantId, clientId, deliverymanId });
    return 'Order created successfully';
  }
}