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
                    serviceLabel: "Service Commande",
                    host: process.env.HOST,
                    port: process.env.PORT,
                    entrypointUrl: "/api/orders",
                    redirectUrl: "/api/orders",
                    routeProtections: [
                        { methods: ["GET"], route: "/:id", roles: ["restaurantOwner", "user", "deliveryman", "admin", "salesman"] },
                        // { methods: [], route: "/:id", roles: [] },
                        { methods: ["GET"], route: "/", roles: ["restaurantOwner", "user", "deliveryman", "admin", "salesman"] },
                        { methods: ["POST"], route: "/", roles: ["user", "admin"] },
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