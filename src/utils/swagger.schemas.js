const orderProperties = {
  articleIdList: { type: "array", items: { type: "string" } },
  date: { type: "string" },
  clientCode: { type: "string" },
  status: { type: "string", default: "orderChecking"},
  restaurantId: { type: "string" },
  clientId: { type: "string" },
  deliverymanId: { type: "string" }
}
const statusProperties = {
  state: { type: "string" }
}
module.exports = {
  //Orders
  schemaCreateOrders: {
    schema: {
      description: 'Create a new order',
      tags: ["Order"],
      body: {
        type: 'object',
        required: ["articleIdList", "date", "clientCode", "restaurantId", "clientId"],
        properties: orderProperties
      }
    }
  },
  schemaPutOrders: {
    schema: {
      description: 'Update the whole data of specified Order',
      tags: ["Order"],
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
        required: ["articleList", "date", "clientCode", "status", "restaurantId", "clientId"],
        properties: orderProperties
      }
    }
  },
  schemaPatchOrders: {
    schema: {
      description: 'Update the partial data of specified Order',
      tags: ["Order"],
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
  schemaGetOrders: {
    schema: {
      description: 'Get all orders',
      tags: ["Order"],
    }
  },
  schemaGetOrderbyClientId: {
    schema: {
      description: 'Get the orders related to a specific client',
      tags: ["Order"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Client id'
          }
        }
      }
    }
  },
  schemaGetOrderbyRestaurantId: {
    schema: {
      description: 'Get the orders related to a specific restaurant',
      tags: ["Order"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Restaurant id'
          }
        }
      }
    }
  },
  schemaGetOrderbyDeliverymanId: {
    schema: {
      description: 'Get the orders related to a specific deliveryman',
      tags: ["Order"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Deliveryman id'
          }
        }
      }
    }
  },
  schemaGetOrderbyId: {
    schema: {
      description: 'Get specified order',
      tags: ["Order"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Order id'
          }
        }
      }
    }
  },
  schemaDeleteOrder: {
    schema: {
      description: 'Delete specified order',
      tags: ["Order"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Order id'
          }
        }
      }
    }
  },
  schemaDeleteOrder: {
    schema: {
      description: 'Delete specified order',
      tags: ["Order"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Order id'
          }
        }
      }
    }
  },
  // Status
  schemaGetStatusbyId: {
    schema: {
      description: 'Get specified Status',
      tags: ["Status"],
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
    }
  },
  schemaPatchStatusById: {
    schema: {
      description: 'Update a Status',
      tags: ["Status"],
      params: {
        type: 'object',
        required: ["state"],
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
        properties: statusProperties
      }
    }
  },
  schemaDeleteStatusById: {
    schema: {
      description: 'Delete specified Status',
      tags: ["Status"],
      params: {
        type: 'object',
        required: ["id"],
        properties: {
          id: {
            type: 'string',
            description: 'Order id'
          }
        }
      }
    }
  },
  schemaGetStatus: {
    schema: {
      description: 'Get all Status',
      tags: ["Status"],
    }
  },
  schemaCreateStatus: {
    schema: {
      description: 'Create a new Status',
      tags: ["Status"],
      body: {
        type: 'object',
        required: ["state"],
        properties: statusProperties
      }
    }
  }
}