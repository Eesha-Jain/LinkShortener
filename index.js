const express = require('express');
const app = express();

//App.use
app.use(express.static('src'));
app.use(express.json());

//App.get
app.get('/', function(req, res) {
  res.sendFile('src/index.html', { root: '.' });
})

//Port
app.listen(process.env.PORT || 8000);
console.log('Running at Port 8000');