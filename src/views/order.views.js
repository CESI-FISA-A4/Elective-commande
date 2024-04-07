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
  invalidPermissions: (() => {
    const err = Error("You do not have the right to alter this order");
    err.statusCode = 403;
    return err;
  })()
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
      return {};
  }
}
function filterQueryToRole(userId, roleLabel, query) {
  let filter = {};
  switch (roleLabel) {
    case "user":
      return { clientId: { $eq: userId } };
    case "deleveryman":
      return { deliverymanId: { $eq: userId } };
    case "restaurantOwner":
      return { restaurantId: { $eq: userId } };
    default:
      if (query.restaurantid) filter["restaurantId"] = { $eq: query.restaurantid }
      if (query.deliverymanid) filter["deliverymanId"] = { $eq: query.deliverymanid }
      if (query.clienttid) filter["clientId"] = { $eq: query.clienttid }
      return filter
  }
}
module.exports = {
  getOrderbyId: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;

    const format = formatResponseToRole(roleLabel);
    const filter = filterQueryToRole(userId, roleLabel, { restaurantid, clienttid, deliverymanid });
    filter["id"] = id;

    if (!isValidObjectId(id)) return errors.invalidId;

    const orders = await Order.findById(filter, format);
    return orders;
  },
  getOrders: async (req, res) => {
    const { userId, roleLabel, restaurantid, clienttid, deliverymanid } = req.query;

    const format = formatResponseToRole(roleLabel);
    const filter = filterQueryToRole(userId, roleLabel, { restaurantid, clienttid, deliverymanid });

    const allOrders = await Order.find(filter, format);
    return allOrders;
  },
  patchOrder: async (req, res) => {
    const { id } = req.params;
    const { articleIdList, date, clientCode, status, restaurantId, clientId, deliverymanId } = req.body;
    const { userId, roleLabel } = req.query;

    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });
    const targetOrder = await Order.findById(id);

    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
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
    const { userId, roleLabel } = req.query;

    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });
    const targetOrder = await Order.findById(id);

    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleIdList || !date || !clientCode || !status || !restaurantId || !clientId || !deliverymanId) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;

    await Order.findByIdAndUpdate(id, { validatedDate, clientCode, status, restaurantId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;
    const targetOrder = await Order.findById(id);

    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
    if (!isValidObjectId(id)) return errors.invalidId;

    const a = await Order.findByIdAndDelete(id)
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