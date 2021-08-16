const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

/*
TASKS FOR NEXT TIME:
- see whether already contains
- do a .get() that navigates to the / if there and a not existant page otherwise
- Debug
*/

//App.use
app.use(express.static('src'));
app.use(express.json());

//App.get
app.get('/', function(req, res) {
  res.sendFile('src/index.html', { root: '.' });
})

//App.post
app.get('/shortLink', function(req, res) {
  var link = req.body.link;
  var custom = req.body.custom;
  const uri = process.env['MONGOLINK'];

  try {
    MongoClient.connect(uri, function(err, client) {
      const dataBase = client.db("linkShortener");
      var customNew = req.body.custom;

      if (customNew == "") {
        customNew = (Math.random()+1).toString(36).substring(7);
      }

      let data = {link: req.body.link, custom: customNew};
      var contains = false;

      if (contains) {
        return res.send(JSON.stringify({error: true, message: "Custom Link already exists"}));
      } else {
        const collection = db.collection('links');
        collection.insert([data], (error, result) => {
          if (error) return res.send(JSON.stringify({error: true, message: "There's an error: Please resubmit"}));
        });

        return res.send(JSON.stringify({error: false, message: "http://linkshortener.queen_race12.repl.co/" + customNew}));
      }
    })
  } catch (e) {
    return res.send(JSON.stringify({error: true, message: "There's an error: Please resubmit"}));
  }
})

//Port
app.listen(process.env.PORT || 8000);
console.log('Running at Port 8000');