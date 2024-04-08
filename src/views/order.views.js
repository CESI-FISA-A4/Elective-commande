const { isValidObjectId } = require("mongoose");
const { Order } = require("../models/order.model");
const { Status } = require("../models/status.model");
const { Restaurant } = require("../models/restaurant.model");
const { Article } = require("../models/article.model");

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
    const err = Error("Unsupported Date format, format : YYYY/MM/DD hh:mm");
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
  })(),
  wrongCode: (() => {
    const err = Error("Client code does not match");
    err.statusCode = 400;
    return err;
  })(),
  wrongCurrentStatus: (() => {
    const err = Error("You can't do that.");
    err.statusCode = 400;
    return err;
  })(),
  tooLatetoUpdate: (() => {
    const err = Error("This order is ongoing and cannot be updated anymore");
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
      return { restaurantId: { $eq: query.restaurantid } };
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
    const targetOrder = await Order.findById(id, format).populate("status").populate("articleList");

    if (roleLabel == "restaurantOwner") {
      const targetRestaurant = await Restaurant.findById(targetOrder.restaurantId)
      if (targetRestaurant.restaurantOwnerId != userId) return errors.invalidPermissions;
    }
    if (!isValidObjectId(id)) return errors.invalidId;
    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
    if (roleLabel == "deleveryman" && targetOrder.deliverymanId != userId) return errors.invalidPermissions;
    let price = 0;
    targetOrder.articleList.map((article) => {
      price += article.price;
    });
    targetOrder.set("totalPrice", price, { strict: false });
    targetOrder.depopulate("articleList");
    return targetOrder;
  },
  getOrders: async (req, res) => {
    const { userId, roleLabel, restaurantid, clienttid, deliverymanid, statusid } = req.query;
    const format = formatResponseToRole(roleLabel);
    const filter = filterQueryToRole(userId, roleLabel, { restaurantid, clienttid, deliverymanid });

    if (statusid) filter["statusId"] = statusid;

    const allOrders = await Order.find(filter, format).populate("status").populate("articleList");
    allOrders.map((order) => {
      let price = 0;
      order.articleList.map((article) => {
        price += article.price;
      });
      order.set("totalPrice", price, { strict: false });
      order.depopulate("articleList");
    });
    return allOrders;
  },
  restaurantCheck: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;
    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "restaurantOwner") {
      const targetRestaurant = await Restaurant.findById(targetOrder.restaurantId);
      if (targetRestaurant.restaurantOwnerId != userId) return errors.invalidPermissions;
    }
    if (targetOrder.status.state != "orderChecking") return errors.statusNotFound;

    req.body = {};
    req.body["status"] = "deliveryChecking";
    return module.exports.patchOrder(req, res);
  },
  deliverymanCheck: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel, deliverymanid } = req.query;

    const targetOrder = await Order.findById(id).populate("status");

    if (targetOrder.status.state != "orderChecking") return errors.statusNotFound;

    req.body = {};
    req.body["status"] = "preparing";
    if (roleLabel == "deliveryman") req.body["deliverymanId"] = userId;
    else if (roleLabel == "admin") req.body["deliverymanId"] = deliverymanid;
    return module.exports.patchOrder(req, res);
  },
  restaurantPrepared: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;

    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "restaurantOwner") {
      const targetRestaurant = await Restaurant.findById(targetOrder.restaurantId);
      if (targetRestaurant.restaurantOwnerId != userId) return errors.invalidPermissions;
    }
    if (targetOrder.status.state != "preparing") return errors.statusNotFound;

    req.body = {};
    req.body["status"] = "delivering";
    return module.exports.patchOrder(req, res);
  },
  deliverymanDelivered: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;

    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "deliveryman" && targetOrder.deliverymanId != userId) return errors.invalidPermissions;
    if (targetOrder.status.state != "delivering") return errors.statusNotFound;
    if (req.body.code != targetOrder.clientCode) return errors.wrongCode;

    req.body = {};
    req.body["status"] = "delivered";
    return module.exports.patchOrder(req, res);
  },
  cancelOrder: async (req, res) => {
    req.body = {};
    req.body["status"] = "aborted";
    return module.exports.patchOrder(req, res);
  },
  patchOrder: async (req, res) => {
    const { id } = req.params;
    const { articleList, date, clientCode, status, restaurantId, clientId, deliverymanId } = req.body;
    const { userId, roleLabel } = req.query;

    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });
    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "user"){
      if (targetOrder.status.state != "orderChecking" && status != "aborted") return errors.tooLatetoUpdate;
      if (status == "aborted" && targetOrder.status.state == "delivered") return errors.tooLatetoUpdate;
      if (targetOrder.clientId != userId) return errors.invalidPermissions;
    }
    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleList && !date && !clientCode && !status && !restaurantId && !clientId && !deliverymanId) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;

    await Order.findByIdAndUpdate(id, { validatedDate, clientCode, status: statusId, restaurantId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  putOrder: async (req, res) => {
    const { id } = req.params;
    const { articleList, date, clientCode, status, restaurantId, clientId, deliverymanId } = req.body;
    const { userId, roleLabel } = req.query;

    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });
    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "user" && targetOrder.status.state != "orderChecking") return errors.tooLatetoUpdate;
    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleList || !date || !clientCode || !status || !restaurantId || !clientId || !deliverymanId) return errors.missingRequiredParams;
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

    await Order.findByIdAndDelete(id)
    return 'Order deleted successfully';
  },
  createOrder: async (req, res) => {
    const { articleList, restaurantId, deliverymanId } = req.body;
    const status = req.body.status ?? "orderChecking";
    const { userId, roleLabel } = req.query;
    const statusId = await Status.findOne({ state: { $eq: status } });

    const date = new Date();
    const formatedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    const clientCode = Math.random().toString(36).substring(2, 12);
    let clientId = req.body.clientId;
    if (roleLabel == "user") clientId = userId;
    if (!restaurantId || !clientId || !articleList) return errors.missingRequiredParams;
    if (status && !statusId) return errors.statusNotFound;

    await Order.create({ articleList, date: formatedDate, clientCode, status: statusId, restaurantId, clientId, deliverymanId });
    return 'Order created successfully';
  }
}