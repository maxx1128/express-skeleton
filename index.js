
var
  http       = require("http"),
  path       = require("path"),
  express    = require("express"),
  logger     = require("morgan"),
  liquid     = require("shopify-liquid"),
  bodyParser = require("body-parser"),
  routes     = require('./routes');
;

var engine = liquid({
    root: __dirname,  // for layouts and partials
    extname: '.liquid'
});

var app = express();

var assetsPath = path.resolve(__dirname, "assets");

app.engine('liquid', engine.express()); 
app.set('views', ['./views', './views/partials', './views/layouts']); 
app.set('view engine', 'liquid');
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

