const pay = require("../controller/pembayaran");

var router = function (app) {
  app.post("/payment/add/:id", function (req, res) {
    pay.payment(req, res, function (result) {
      res.json(result);
    });
  });
  app.get("/payment", function (req, res) {
    pay.getall(req, res, function (result) {
      res.json(result);
    });
  });
  app.get("/payment/:id", function (req, res) {
    pay.getById(req, res, function (result) {
      res.json(result);
    });
  });
};
module.exports = router;
