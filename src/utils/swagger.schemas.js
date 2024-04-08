const orderProperties = {
  articleList: { type: "array", items: { type: "string" } },
  clientCode: { type: "string" },
  status: { type: "string" },
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
        required: ["articleList", "restaurantId"],
        properties: {
          articleList: { type: "array", items: { type: "string" } },
          restaurantId: { type: "string" }
        }
      }
    }
  },
  schemaNextStep: {
    schema: {
      description: 'Go to the next step',
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
  schemaFinalStep: {
    schema: {
      description: 'Validate delivery',
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
        required: ["code"],
        properties: {
          code: {
            type: 'string',
            description: 'code'
          }
        }
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
        required: ["articleList", "clientCode", "status", "restaurantId", "clientId"],
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
      query: {
        restaurantid: {
          type: 'string',
          description: 'restaurant id'
        },
        clienttid: {
          type: 'string',
          description: 'Client id'
        },
        deliverymanid: {
          type: 'string',
          description: 'deliveryman id'
        },
        statusid: {
          type: 'string',
          description: 'status id'
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