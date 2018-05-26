let interceptConfig = {};
const pathToRegexp = require('path-to-regexp');

module.exports = {
  interceptRequest: function (req, res) {
    for (let i in interceptConfig) {
      if (Object.prototype.hasOwnProperty.call(interceptConfig, i)) {
        if (pathToRegexp(i).exec(req.path)) {
          res.send(interceptConfig[i]);
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
