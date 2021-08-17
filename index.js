const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

//App.use
app.use(express.static('src'));
app.use(express.json());

//App.get
app.get('/', function(req, res) {
  res.sendFile('src/index.html', { root: '.' });
})

app.get("/:link", function(req, res) {
  try {
    const uri = process.env['MONGOLINK'];
    const custom = req.params.link;

    MongoClient.connect(uri, async function(err, client) {
      const db = client.db("linkShortener");
      const collection = db.collection('links');

      var contains = await collection.find({custom: custom });

      if (contains.count() == 0) {
        res.sendFile('src/error.html', { root: '.' });
      } else {
        contains.forEach(function (doc) {
          res.redirect(doc.link);
        });
      }
    })
  } catch (e) {
    res.sendFile('src/error.html', { root: '.' });
  }
})

//App.post
app.post('/shortLink', function(req, res) {
  try {
    const uri = process.env['MONGOLINK'];

    MongoClient.connect(uri, async function(err, client) {
      const db = client.db("linkShortener");
      const collection = db.collection('links');
      var customNew = req.body.custom;

      if (customNew == "") {
        customNew = (Math.random()+1).toString(36).substring(10);
        var contains = await collection.find({custom: customNew }).count();
        while (contains != 0) {
          customNew = (Math.random()+1).toString(36).substring(10);
          contains = await collection.find({custom: customNew }).count();
        }
      }

      let data = {link: req.body.link, custom: customNew};
      var contains = await collection.find({custom: customNew }).count();

      if (contains != 0) {
        return res.send(JSON.stringify({error: true, message: "Custom Link already exists"}));
      } else {
        await collection.insertOne(data, (error, result) => {
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