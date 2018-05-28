const http = require('http');
const url = require('url');
const {interceptRequest} = require('./intercept-request');

class MinProxy {
  constructor (options = {}) {
    this.port = options.port || 9393;
    this.proxyUrl = options.proxyUrl || '';
    this.onServerError = options.onServerError || function () {};
    this.onBeforeRequest = options.onBeforeRequest || function () {};
    this.onListening = options.onListening || function () {};
  }

  start () {
    const server = http.createServer();
    server.on('error', this.onServerError);
    server.on('request', this.requestHandler.bind(this));
    // server.on('beforeRequest', this.onBeforeRequest);
    server.listen(this.port, this.onListening);
  }

  requestHandler (req, res) {
    var path = req.headers.path || url.parse(req.url).path;
    const {hostname, port} = url.parse(this.proxyUrl);
    var requestOptions = {
      host: hostname,
      port: port || 80,
      path: path,
      method: req.method,
      headers: req.headers
    };

    this.onBeforeRequest(requestOptions);

    applyCorsStrategy(req, res);

    // preflight
    if (String.prototype.toLocaleLowerCase.call(requestOptions.method) === 'options') {
      res.statusCode = 200;
      res.setHeader('Content-Length', '0');
      res.end();
      return;
    }

    if (interceptRequest(requestOptions, res)) {
      return;
    }

    var remoteRequest = http.request(requestOptions, function (remoteResponse) {
      // write out headers to handle redirects
      res.writeHead(remoteResponse.statusCode, remoteResponse.statusMessage || '', remoteResponse.headers);

      remoteResponse.pipe(res);
      // Res could not write, but it could close connection
      res.pipe(remoteResponse);
    });

    remoteRequest.on('error', function (e) {
      console.log(e);
      res.writeHead(502, 'Proxy fetch failed');
      res.end();
      remoteRequest.end();
    });

    req.pipe(remoteRequest);

    // Just in case if socket will be shutdown before http.request will connect
    // to the server.
    res.on('close', function () {
      remoteRequest.abort()
    });
  }
}

function applyCorsStrategy (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers['access-control-request-method']) {
    res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
  }
  if (req.headers['access-control-request-headers']) {
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  }
}

module.exports = applyCorsStrategy;
module.exports = MinProxy;
