var express = require('express'),
  app = express(),
  path = require('path'),
  http = require('http'),
  Client = require('xtuple-rest-client');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.locals.title = "xTuple REST To Do App";
app.set("views", path.join( __dirname, "views" ));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
  new Client(function (client) {
    client.query({
      type: 'ToDo',
      method: 'list',
      params: { maxResults: 50 },
      callback: function (err, result) {
        if (err) {
          res.send('Error:', err);
        }
        if (result) {
          app.locals.todos = result.data.data;
          res.render("old");
        }
      }
    });
  });
});

app.get("/add_todo", function (req, res){
  new Client(function (client) {
    client.query({
      type: 'ToDo',
      method: 'insert',
      params: {
        dueDate: req.query.duedate,
        status: req.query.status,
        isActive: true,
        description: req.query.description
      },
      callback: function (err, result) {
        if (err) {
          res.send('Error:', err);
          return;
        }
        justAdded = result.data.id;
        res.send('Inserted:', result.data.id);
      }
    });
  });
});

app.get("/get_todo", function (req, res){
  new Client(function (client) {
    client.query({
      type: 'ToDo',
      method: 'get',
      params: {uuid: req.query.id},
      callback: function (err, result) {
        if (err) {
          res.send('Error:', err);
          return;
        }
        res.send('To Do:', result);
      }
    });
  });
});

http.createServer(app).listen(app.get("port"), function () {
  console.log("xTuple REST To Do app is running at localhost:", app.get("port"));
});
