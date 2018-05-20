const http = require('http');
const url = require('url');

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
    const {host, port} = url.parse(this.proxyUrl);
    var requestOptions = {
      host: host,
      port: port || 80,
      path: path,
      method: req.method,
      headers: req.headers
    };

    this.onBeforeRequest(requestOptions);

    var remoteRequest = http.request(requestOptions, function (remoteResponse) {
      // write out headers to handle redirects
      res.writeHead(remoteResponse.statusCode, remoteResponse.statusMessage || '', Object.assign({}, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }, remoteResponse.headers));

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

module.exports = MinProxy;
