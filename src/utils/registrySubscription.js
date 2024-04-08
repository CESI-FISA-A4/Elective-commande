const axios = require("axios");
require('dotenv').config();

module.exports = {
    subscribeToApiGateway: async () => {
        // Order
        try {
            const response = await axios({
                method: "POST",
                baseURL: `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`,
                url: `/registry/services`,
                data: {
                    serviceIdentifier: "order-service",
                    serviceLabel: "Service Commande",
                    host: process.env.HOST,
                    port: process.env.PORT,
                    entrypointUrl: "/api/orders",
                    redirectUrl: "/api/orders",
                    routeProtections: [
                        // Orders
                        { methods: ["GET"], route: "/", roles: ["restaurantOwner", "user", "deliveryman", "admin", "salesman"] },
                        { methods: ["POST"], route: "/", roles: ["user", "admin"] },
                        { methods: ["POST"], route: "/:id/restaurant-checked", roles: ["restaurantOwner", "admin"] },
                        { methods: ["POST"], route: "/:id/deliveryman-checked", roles: ["deliveryman", "admin"] },
                        { methods: ["POST"], route: "/:id/prepared", roles: ["restaurantOwner", "admin"] },
                        { methods: ["POST"], route: "/:id/delivered", roles: ["deliveryman", "admin"] },
                        { methods: ["POST"], route: "/:id/abort", roles: ["user", "restaurantOwner", "admin"] },
                        { methods: ["GET"], route: "/:id", roles: ["restaurantOwner", "user", "deliveryman", "admin", "salesman"] },
                        { methods: ["PATCH", "PUT", "DELETE"], route: "/:id", roles: ["user", "admin"] },
                        // Status
                        { methods: ["POST"], route: "/status", roles: ["admin", "technician"] },
                        { methods: ["DELETE", "PATCH"], route: "/status/:id", roles: ["admin", "technician"] }
                    ]
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}