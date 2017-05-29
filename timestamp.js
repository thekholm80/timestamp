var express = require('express');
var app = express();

function getUnix(date) {
  if (isNaN(Date.parse(date))) { return null };

  return Date.parse(date) / 1000;
}

function getNatural(date) {
  var d = new Date(date * 1000);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'];
  var month = months[d.getMonth()];
  var day = d.getDate();
  var year = d.getFullYear();
  var myDate = month + ' ' + day + ', ' + year;

  return myDate;
}

function parseNatural(date) {
  var unix = getUnix(date);

  if (unix === null) {
    date = null
  } else {
    date = getNatural(unix);
  }

  var json = {
    'unix': unix,
    'natural': date
  };

  return json;
}

function parseUnix(date) {
  var natural = getNatural(date);
  var json = {
    'unix': date,
    'natural': natural
  };

  return json;
}

function parseDate(date) {
  var regex = /\D/g;

  if(regex.test(date)) {
    return parseNatural(date);
  } else {
    return parseUnix(date);
  }
}

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  response.sendFile( __dirname + '/public/' + 'index.html');
});

app.get('/*', function (request, response) {
  //console.log(request.params[0]);
  response.send(parseDate(request.params[0]));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
