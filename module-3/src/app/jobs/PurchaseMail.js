const Mail = require("../services/Mail");

class PurchaseMail {
  get key() {
    return "PurchaseMail";
  }

  async handle(job, done) {
    const { purchaseAd, user, content } = job.data;
    await Mail.sendMail({
      from: '"Renan Moreira Santos" <renanmoreirasan@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Purchase require: ${purchaseAd.title}`,
      template: "purchase",
      context: {
        user,
        content,
        purchaseAd
      }
    });

    return done();
  }
}

module.exports = new PurchaseMail();
