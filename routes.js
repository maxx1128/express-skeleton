var
  express   = require("express"),
  router    = express.Router()
;

router.get("/", function(request, response) {

  response.render("index", {
    title: "Express Skeleton!"
  });
});

module.exports = router;
