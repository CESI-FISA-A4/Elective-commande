require('dotenv').config();
const orderRoutes = require('./src/routes/order.routes');
const { initDatabase } = require('./src/utils/initMongoDB');
const { setupSwagger } = require('./src/utils/swagger');
const { subscribeToApiGateway } = require('./src/utils/registrySubscription');
const statusRoutes = require('./src/routes/status.routes');
const setupStatus = require('./src/utils/setupStatus');
const fastify = require("fastify")();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

initDatabase();
setupSwagger(fastify);
subscribeToApiGateway();
setupStatus()

fastify.register(orderRoutes, { prefix: "/api/orders" });
fastify.register(statusRoutes, { prefix: "/api/status" });

fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server started : ${PORT}`);
})