// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
var express = require("express");
var app = express();
var low = require("lowdb");
var bodyParser = require('body-parser');
var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync('db.json');
var db = low(adapter);

db.defaults({ todos: [] })
  .write();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// https://expressjs.com/en/starter/basic-routing.html
app.get("/todos", (request, response) => {
  response.render('index', {
    listTodo: db.get('todos').value()
  })
});

console.log(db.get('todos').value());

app.get("/todos/search", (req, res) => {
    var q = req.query.q;
    var matchedTodos = db.get('todos').value().filter(function(a) {
      return a.q.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
  res.render("index", {
    listTodo: matchedTodos
  });
});

app.post("/todos/create", (req, res) => {
    db.get('todos').push(req.body).write();
    res.redirect('/todos');
});
// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
