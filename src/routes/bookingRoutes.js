const book = require("../controller/booking");

var router = function (app) {
    app.post("/booking/add", function (req, res) {
      book.addBooking(req, res, function (result) {
        res.json(result);
      });
    });
    app.get("/booking", function (req, res) {
      book.getall(req, res, function (result) {
        res.json(result);
      });
    });
    app.get("/booking/:id", function (req, res) {
      book.getById(req, res, function (result) {
        res.json(result);
      });
    });
  }
  module.exports = router;