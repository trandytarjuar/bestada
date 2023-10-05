const slot = require("../controller/slot");
var router = function (app) {
  app.get("/checkslot", function (req, res) {
    slot.checkslot(req, res, function (result) {
      res.json(result);
    });
  });
}
module.exports = router;
