const { schemaPutOrders, schemaPatchOrders, schemaCreateOrders, schemaGetOrders, schemaGetOrderbyId, schemaDeleteOrder } = require("../utils/swagger.schemas");
const { createOrder, deleteOrder, getOrders, getOrderbyId, patchOrder, putOrder } = require("../views/order.views");

const orderRoutes = function (instance, opts, next) {
  instance.get('/', schemaGetOrders, getOrders);
  instance.post('/', schemaCreateOrders, createOrder);
  instance.get('/:id', schemaGetOrderbyId, getOrderbyId);
  instance.delete('/:id', schemaDeleteOrder, deleteOrder);
  instance.put('/:id', schemaPutOrders, putOrder);
  instance.patch('/:id', schemaPatchOrders, patchOrder);
  next();
};

module.exports = orderRoutes;