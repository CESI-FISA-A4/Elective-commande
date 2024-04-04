const axios = require("axios");
require('dotenv').config();

module.exports = {
    subscribeToApiGateway: async() => {
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
                        { methods: ["GET"], route: "/:id", roles: [] },
                        { methods: [], route: "/:id", roles: [] },
                        { route: "/", roles: ["admin"] }
                    ]
                }
            });
            
        } catch (error) {
            console.log(error);
        }
        // Status
        try {
            const response = await axios({
                method: "POST",
                baseURL: `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`,
                url: `/registry/services`,
                data: {
                    serviceLabel: "Service Commande",
                    host: process.env.HOST,
                    port: process.env.PORT,
                    entrypointUrl: "/api/status",
                    redirectUrl: "/api/status",
                    routeProtections: [
                        { methods: ["POST"], route: "/", roles: ["admin","technician"] },
                        { methods: ["DELETE","PATCH"], route: "/:id", roles: ["admin","technician"] }
                    ]
                }
            });
            
        } catch (error) {
            console.log(error);
        }
    }
}