const { Status } = require("../models/status.model");

module.exports = async function setupStatus() {
  const baseStatus = ["orderChecking", "deliveryChecking", "preparing", "delivering", "delivered", "aborted"]
  baseStatus.map(async (status) => {
    if (await Status.findOne({ state: { $eq: status } })) return console.log(`status ${status} already exists`);;
    const newStatus = new Status({ state: status });
    newStatus.save();
  })
}