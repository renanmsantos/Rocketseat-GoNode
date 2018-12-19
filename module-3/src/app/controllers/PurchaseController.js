const Ad = require("../models/Ad");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseMail = require("../jobs/PurchaseMail");
const Queue = require("../services/Queue");

class PurchaseController {
  async index(req, res) {
    const filters = {};
    const pur = await Purchase.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ["user", "ad"],
      sort: "-createdAt"
    });
    return res.json(pur);
  }

  async store(req, res) {
    const { ad, content } = req.body;
    const purchaseAd = await Ad.findById(ad).populate([
      "author",
      "purchasedBy"
    ]);
    const user = await User.findById(req.userId);

    if (purchaseAd.purchasedBy != null) {
      return res.status(400).json({
        error: "Purchased"
      });
    }

    await Purchase.create({ ad, user, content });

    Queue.create(PurchaseMail.key, {
      purchaseAd,
      user,
      content
    }).save();

    return res.send();
  }

  async accept(req, res) {
    const pur = await Purchase.findById(req.params.id);
    await Ad.findByIdAndUpdate(pur.ad, { purchasedBy: pur }, { new: true });

    return res.json(pur);
  }

  async destroy(req, res) {
    await Purchase.findByIdAndDelete(req.params.id);
    return res.send();
  }
}

module.exports = new PurchaseController();
