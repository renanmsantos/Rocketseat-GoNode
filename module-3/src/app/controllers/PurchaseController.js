const Ad = require("../models/Ad");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseMail = require("../jobs/PurchaseMail");
const Queue = require("../services/Queue");

class PurchaseController {
  async store(req, res) {
    const { ad, content } = req.body;
    const purchaseAd = await Ad.findById(ad).populate("author");
    const user = await User.findById(req.userId);

    await Purchase.create({ ad, user, content });

    Queue.create(PurchaseMail.key, {
      purchaseAd,
      user,
      content
    }).save();

    return res.send();
  }
}

module.exports = new PurchaseController();
