const orderProperties = {
  articleList: { type: "array", items: { type: "number" } },
  date: { type: "string" },
  clientCode: { type: "string" },
  statusId: { type: "string" },
  restaurantId: { type: "string" },
  clientId: { type: "string" },
  deliverymanId: { type: "string" }
}
module.exports = {
  schemaCreateOrders: {
    schema: {
      description: 'Create a new order',
      body: {
        type: 'object',
        required: ["articleList", "date", "clientCode", "statusId", "restaurantId", "clientId"],
        properties: orderProperties
      }
    }
  },
  schemaPutOrders: {
    schema: {
      description: 'Update the whole data of specified Order',
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Order id'
          }
        }
      },
      body: {
        type: 'object',
        required: ["articleList", "date", "clientCode", "statusId", "restaurantId", "clientId"],
        properties: orderProperties
      }
    }
  },
  schemaPatchOrders: {
    schema: {
      description: 'Update the partial data of specified Order',
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Order id'
          }
        }
      },
      body: {
        type: 'object',
        required: [],
        properties: orderProperties
      }
    }
  },
}