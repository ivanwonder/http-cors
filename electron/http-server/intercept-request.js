let interceptConfig = {};
const pathToRegexp = require('path-to-regexp');

module.exports = {
  interceptRequest: function (req, res) {
    for (let i in interceptConfig) {
      if (Object.prototype.hasOwnProperty.call(interceptConfig, i)) {
        if (pathToRegexp(i).exec(req.path)) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          let bodyData = interceptConfig[i];
          bodyData = (typeof bodyData === 'string') ? bodyData : JSON.stringify(bodyData);
          res.write(bodyData);
          res.end();
          return true;
        }
      }
    }
    return false;
  },
  add: function (json) {
    interceptConfig = json;
  }
};
