const express = require("express");

const routes = express.Router();
const multerConfig = require("./config/multer");

const authMiddleware = require("./app/middlewares/auth");
const guestMiddleware = require("./app/middlewares/guest");

const upload = require("multer")(multerConfig);

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");

routes.get("/", guestMiddleware, SessionController.create);
routes.post("/signin", SessionController.store);

routes.get("/signup", guestMiddleware, UserController.create);
routes.post("/signup", upload.single("avatar"), UserController.store);

routes.use("/app", authMiddleware);

routes.get("/app/dashboard", (req, res) => {
  console.log(req.session.user);
  res.render("dashboard");
});

routes.get("/app/logout", SessionController.destroy);

module.exports = routes;
