const { mongoose, isValidObjectId } = require("mongoose");
const { Status } = require("../models/status.model");
const secretKey = process.env.JWT_SIGN_SECRET;

const errors = {
  invalidId: (() => {
    const err = Error("Invalid Id format");
    err.statusCode = 400;
    return err;
  })(),
  missingRequiredParams: (() => {
    const err = Error("Not all required parameters filled");
    err.statusCode = 400;
    return err;
  })(),
}
module.exports = {
  getStatusbyId: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;

    const status = await Status.findById(id);
    return status;
  },
  getStatus: async (req, res) => {
    const allStatus = await Status.find();
    return allStatus;
  },
  patchStatus: async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;

    if (!isValidObjectId(id)) return errors.invalidId;
    if (!state) return errors.missingRequiredParams;

    await Status.findByIdAndUpdate(id, { state });
    return 'Status updated successfully';
  },
  deleteStatus: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return errors.invalidId;

    await Status.findByIdAndDelete(id)
    return 'Status deleted successfully';
  },
  createStatus: async (req, res) => {
    const state = req.body.state;
    if (!state) return errors.missingRequiredParams;
    await Status.create({ state });
    return 'Status created successfully';
  }
}