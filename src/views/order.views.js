const { mongoose, isValidObjectId } = require("mongoose");
const { Order } = require("../models/order.model");
const { Status } = require("../models/status.model");

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
  invalidDateFormat: (() => {
    const err = Error("Unsupported Date format, ex: 2024-04-04T17:45:50.705Z");
    err.statusCode = 400;
    return err;
  })(),
  statusNotFound: (() => {
    const err = Error("Specified status does not exists");
    err.statusCode = 400;
    return err;
  })(),
}

function formatResponseToRole(rolelabel) {
  switch (rolelabel) {
    case "user":
      return {};
    case "admin":
      return {};
    case "deleveryman":
      return { clientCode: 0 };
    case "restaurantOwner":
      return { clientCode: 0 };
    case "salesman":
      return { clientCode: 0 };
    case "technician":
      return {};
    case "developer":
      return {};
    default:
      // return {};
      return { clientCode: 0, restaurantId: 0, clientId: 0, deliverymanId: 0 };
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
    const { articleIdList, date, clientCode, status, restaurantId, clientId, deliverymanId } = req.body;
    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });

    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleIdList && !date && !clientCode && !status && !restaurantId && !clientId && !deliverymanId) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;

    await Order.findByIdAndUpdate(id, { validatedDate, clientCode, statusId, restaurantId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  putOrder: async (req, res) => {
    const { id } = req.params;
    const { articleIdList, date, clientCode, status, restaurantId, clientId, deliverymanId } = req.body;
    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });

    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleIdList || !date || !clientCode || !status || !restaurantId || !clientId || !deliverymanId) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;

    await Order.findByIdAndUpdate(id, { validatedDate, clientCode, status, restaurantId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  deleteOrder: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;

    const a = await Order.findByIdAndDelete(id)
    console.log(a);
    return 'Order deleted successfully';
  },
  createOrder: async (req, res) => {
    const { articleIdList, date, clientCode, restaurantId, clientId, deliverymanId } = req.body;
    const validatedDate = new Date(date);
    const status = req.body.status ?? "orderChecking";
    const statusId = await Status.findOne({ state: { $eq: status } });

    if (!date || !clientCode || !restaurantId || !clientId) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;
    
    await Order.create({ articleIdList, date, clientCode, statusId, restaurantId, clientId, deliverymanId });
    return 'Order created successfully';
  }
}