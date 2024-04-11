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
    case "deliveryman":
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
    case "deliveryman":
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
  ping: async (req, res) => {
    return;
  },
  getOrderbyId: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;
    const format = formatResponseToRole(roleLabel);
    const targetOrder = await Order.findById(id, format).populate("status").populate("articleList.article");

    if (roleLabel == "restaurantOwner") {
      const targetRestaurant = await Restaurant.findById(targetOrder.restaurantId)
      if (targetRestaurant.restaurantOwnerId != userId) return errors.invalidPermissions;
    }
    if (!isValidObjectId(id)) return errors.invalidId;
    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
    if (roleLabel == "deliveryman" && targetOrder.deliverymanId != userId) return errors.invalidPermissions;
    let price = 0;
    targetOrder.articleList.map((selectedArticle) => {
      price += selectedArticle?.article?.price * selectedArticle.quantity;
    });
    targetOrder.set("totalPrice", price, { strict: false });
    return targetOrder;
  },
  getOrders: async (req, res) => {
    const { userId, roleLabel, restaurantid, clienttid, deliverymanid, statusid } = req.query;
    const format = formatResponseToRole(roleLabel);
    const filter = filterQueryToRole(userId, roleLabel, { restaurantid, clienttid, deliverymanid });

    if (statusid) filter["statusId"] = statusid;

    const allOrders = await Order.find(filter, format).populate("status").populate("articleList.article").sort({_id:-1});
    allOrders.map((order) => {
      let price = 0;
      order.articleList.map((selectedArticle) => {
        price += selectedArticle?.article?.price * selectedArticle.quantity;
      });
      order.set("totalPrice", price, { strict: false });
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
    if (targetOrder.status.state != "orderChecking") return errors.wrongCurrentStatus;

    req.body = {};
    req.body["status"] = "deliveryChecking";
    return module.exports.patchOrder(req, res);
  },
  deliverymanCheck: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel, deliverymanid } = req.query;

    const targetOrder = await Order.findById(id).populate("status");

    if (targetOrder.status.state != "deliveryChecking") return errors.wrongCurrentStatus;

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
    if (targetOrder.status.state != "preparing") return errors.wrongCurrentStatus;

    req.body = {};
    req.body["status"] = "delivering";
    return module.exports.patchOrder(req, res);
  },
  deliverymanDelivered: async (req, res) => {
    const { id } = req.params;
    const { userId, roleLabel } = req.query;

    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "deliveryman" && targetOrder.deliverymanId != userId) return errors.invalidPermissions;
    if (targetOrder.status.state != "delivering") return errors.wrongCurrentStatus;
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
  validateOrder: async (req, res) => {
    req.body = {};
    req.body["status"] = "orderChecking";
    return module.exports.patchOrder(req, res);
  },
  patchOrder: async (req, res) => {
    const { id } = req.params;
    const { articleList, date, clientCode, status, clientId, deliverymanId, address } = req.body;
    const { userId, roleLabel } = req.query;

    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });
    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "user") {
      if (targetOrder.status.state != "orderCreated" && status != "aborted") return errors.tooLatetoUpdate;
      if (status == "aborted" && (targetOrder.status.state == "delivered" || targetOrder.status.state == "aborted")) return errors.tooLatetoUpdate;
      if (targetOrder.clientId != userId) return errors.invalidPermissions;
    }
    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleList && !date && !clientCode && !status && !clientId && !deliverymanId && !address) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;

    await Order.findByIdAndUpdate(id, { validatedDate, clientCode, status: statusId, clientId, deliverymanId });
    return 'Order updated successfully';
  },
  putOrder: async (req, res) => {
    const { id } = req.params;
    const { articleList, date, clientCode, status, clientId, deliverymanId, address } = req.body;
    const { userId, roleLabel } = req.query;

    const validatedDate = new Date(date);
    const statusId = await Status.findOne({ state: { $eq: status } });
    const targetOrder = await Order.findById(id).populate("status");

    if (roleLabel == "user" && targetOrder.status.state != "orderCreated"  && status != "aborted") return errors.tooLatetoUpdate;
    if (roleLabel == "user" && targetOrder.clientId != userId) return errors.invalidPermissions;
    if (!isValidObjectId(id)) return errors.invalidId;
    if (!articleList || !date || !clientCode || !status || !clientId || !deliverymanId || !address) return errors.missingRequiredParams;
    if (date && (!validatedDate || validatedDate == "Invalid Date")) return errors.invalidDateFormat;
    if (status && !statusId) return errors.statusNotFound;

    await Order.findByIdAndUpdate(id, { validatedDate, clientCode, status, clientId, deliverymanId, address });
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
    const { articleList, restaurantId, deliverymanId, address } = req.body;
    const status = req.body.status ?? "orderCreated";
    const { userId, roleLabel } = req.query;
    const statusId = await Status.findOne({ state: { $eq: status } });

    const date = new Date();
    const formatedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    const clientCode = Math.random().toString(36).substring(2, 12);
    let clientId = req.body.clientId;
    if (roleLabel == "user") clientId = userId;
    if (!restaurantId || !clientId || !articleList || !address) return errors.missingRequiredParams;
    if (status && !statusId) return errors.statusNotFound;

    const newOrder = await Order.create({ articleList, date: formatedDate, clientCode, status: statusId, restaurantId, clientId, deliverymanId, address });
    return { msg: 'Order created successfully', id: newOrder._id };
  },
  getAvailableOrders : async (req,res) =>{
    const availableStatus = await Status.findOne({state: {$eq: "deliveryChecking"}});
    const orderList = await Order.find({status : {$eq: availableStatus._id}}).populate("restaurantId");
    const formatedList = []
    orderList.map((order)=>{
      formatedList.push(
        {
          id: order._id,
          nomResto: order.restaurantId.name,
          addressResto: order.restaurantId.address,
          addressLivraison: order.address
        }
      )
    })
    return formatedList;
  },
  getPreparedOrders : async (req,res) =>{
    const availableStatus = await Status.findOne({state: {$eq: "delivering"}});
    const orderList = await Order.find({status : {$eq: availableStatus._id}}).populate("restaurantId");
    const formatedList = []
    orderList.map((order)=>{
      formatedList.push(
        {
          id: order._id,
          nomResto: order.restaurantId.name,
          addressResto: order.restaurantId.address,
          addressLivraison: order.address
        }
      )
    })
    return formatedList;
  },
  getCreatedOrders : async (req,res) =>{
    const availableStatus = await Status.findOne({state: {$eq: "orderCreated"}});
    const orderList = await Order.find({status : {$eq: availableStatus._id}}).populate("restaurantId").populate("articleList.article");
    const formatedList = []
    orderList.map((order)=>{
      formatedList.push(
        {
          id: order._id,
          articleList: order.articleList
        }
      )
    })
    return formatedList;
  }
}