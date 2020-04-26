const request = require('request');
require('dotenv').config();

//Sendy subscription function
function subscribe(name, email) {
  return new Promise(function(resolve, reject) {
    var result = '';
    const options = {
      url: process.env.SENDY_HOST + "/subscribe",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        "api_key": process.env.SENDY_API_KEY,
        "name": name,
        "email": email,
        "list": process.env.SENDY_LIST
      }
    }

    request(options, function (err, res, body) {
      if(err) console.log(err);
      resolve(body);
    });
  });
}

//Sendy unsubscribe function
function unsubscribe(email) {
  return new Promise(function(resolve, reject) {
    var result = '';
    const options = {
      url: process.env.SENDY_HOST + "/unsubscribe",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        "email": email,
        "list": process.env.SENDY_LIST
      }
    }

    request(options, function (err, res, body) {
      if(err) console.log(err);
      resolve(body);
    });
  });
}

module.exports.handler = async (event) => {

  var data = '';
  var eventType = event.headers["X-Discourse-Event-Type"];

  if (eventType == "ping") {
    data = 'A ping was received from Discourse';
  }
  else if (eventType == "user" && event.headers["X-Discourse-Event"] == "user_created") {
    var validJSON = JSON.parse(event.body);
    data = await subscribe(validJSON.user.name, validJSON.user.email);
  }
  else if (eventType == "user" && event.headers["X-Discourse-Event"] == "user_destroyed") {
    var validJSON = JSON.parse(event.body);
    data = await unsubscribe(validJSON.user.email);
  }
  else data = "No preference set for this event type";
  return sendRes(200, data);

};

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "text/html"
    },
    body: body
  };
  return response;
};
