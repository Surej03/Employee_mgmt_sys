const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

require("dotenv").config(); // To access data from a common place

const app = express();
const port = 7000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//static files
app.use(express.static("public"));

//Template engine
const handlebars = exphbs.create({extname:".hbs"});
app.engine('hbs', handlebars.engine);
app.set("view engine", 'hbs');



//routes
const routes = require("./server/controllers/routes/emp");
app.use('/', routes);


app.listen(port, () => {
    console.log("Server is running at port: " + port);
});
