const { schemaPutOrders, schemaPatchOrders, schemaCreateOrders, schemaGetOrders, schemaGetOrderbyId, schemaDeleteOrder, schemaNextStep, schemaFinalStep, schemaAbortOrder } = require("../utils/swagger.schemas");
const { createOrder, deleteOrder, getOrders, getOrderbyId, patchOrder, putOrder, restaurantCheck, deliverymanCheck, restaurantPrepared, deliverymanDelivered, cancelOrder } = require("../views/order.views");

const orderRoutes = function (instance, opts, next) {
  instance.get('/', schemaGetOrders, getOrders);
  instance.post('/', schemaCreateOrders, createOrder);
  instance.post('/:id/abort', schemaAbortOrder, cancelOrder);
  instance.post('/:id/restaurant-checked', schemaNextStep, restaurantCheck);
  instance.post('/:id/deliveryman-checked', schemaNextStep, deliverymanCheck);
  instance.post('/:id/prepared', schemaNextStep, restaurantPrepared);
  instance.post('/:id/delivered', schemaFinalStep, deliverymanDelivered);
  instance.get('/:id', schemaGetOrderbyId, getOrderbyId);
  instance.delete('/:id', schemaDeleteOrder, deleteOrder);
  instance.put('/:id', schemaPutOrders, putOrder);
  instance.patch('/:id', schemaPatchOrders, patchOrder);
  next();
};

module.exports = orderRoutes;