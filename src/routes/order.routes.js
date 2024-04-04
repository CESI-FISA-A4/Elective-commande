const { createOrder,deleteOrder,getOrders,getOrderbyId,patchOrder,putOrder, getOrderbyClientId, getOrderbyRestaurantId, getOrderbyDeliverymanId } = require("../views/order.views");

const orderRoutes = function(instance, opts, next) {
  instance.get('/', getOrders);
  instance.post('/', createOrder);
  instance.get('/getClientOrders/:id', getOrderbyClientId);
  instance.get('/getRestaurantOrders/:id', getOrderbyRestaurantId);
  instance.get('/getDeliverymanOrders/:id', getOrderbyDeliverymanId);
  instance.get('/:id', getOrderbyId);
  instance.delete('/:id', deleteOrder);
  instance.put('/:id', putOrder);
  instance.patch('/:id', patchOrder);
  next();
};

module.exports = orderRoutes;