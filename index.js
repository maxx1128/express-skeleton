
var
  http       = require("http"),
  path       = require("path"),
  ejs        = require("ejs"),
  express    = require("express"),
  logger     = require("morgan"),
  bodyParser = require("body-parser"),
  routes     = require('./routes');
;

var app = express();

var assetsPath = path.resolve(__dirname, "assets");

app.set('views', ['./views', './views/partials']); 
app.set('view engine', 'ejs');
app.use("/assets", express.static(assetsPath));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
// Put other middleware here!

app.use(logger("dev"));

app.use(function(request, response) {
  response.status(404).render("404");
});

http.createServer(app).listen(3000, function(){
  console.log('App skeleton started on port 3000.');
});

module.exports = app;
