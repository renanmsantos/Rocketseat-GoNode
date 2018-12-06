const moment = require("moment");
const { Op } = require("sequelize");

const { User, Appointment } = require("../models");

class AppointmentController {
  async index(req, res) {
    const date = moment(parseInt(req.query.date));
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: "user" }],
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf("day").format(),
            date.endOf("day").format()
          ]
        }
      }
    });

    return res.render("appointments/index", { appointments });
  }

  async create(req, res) {
    const provider = await User.findByPk(req.params.provider);
    return res.render("appointments/create", { provider });
  }

  async store(req, res) {
    const { id } = req.session.user;
    const { provider } = req.params;
    const { date } = req.body;

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    });
    return res.redirect("/app/dashboard");
  }
}

module.exports = new AppointmentController();
