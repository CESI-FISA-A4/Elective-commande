const { schemaGetStatus, schemaDeleteStatusById, schemaGetStatusbyId, schemaPatchStatusById, schemaCreateStatus } = require("../utils/swagger.schemas");
const { createStatus, deleteStatus, patchStatus, getStatus, getStatusbyId } = require("../views/status.views");

const statusRoutes = function (instance, opts, next) {
  instance.get('/', schemaGetStatus, getStatus);
  instance.post('/', schemaCreateStatus, createStatus);
  instance.get('/:id', schemaGetStatusbyId, getStatusbyId);
  instance.delete('/:id', schemaDeleteStatusById, deleteStatus);
  instance.patch('/:id', schemaPatchStatusById, patchStatus);
  next();
};

module.exports = statusRoutes;