const MiniProxy = require('./electron/resource/http-server/cors-http');

var myProxy = new MiniProxy({
  'port': 8080,
  proxyUrl: 'http://192.168.1.122:8090',
  'onBeforeRequest': function (requestOptions) {
    console.log('proxy request : ' + (new Date()).toLocaleString() + '|' + (requestOptions.requestAddress || '') + '|' + (requestOptions.path || '') + '|' + (requestOptions.port || ''))
  },
  'onServerError': function (e) {
    console.log(e);
    // process.send({ error: e.message })
  },
  'onListening': function () {
    // process.send({success: 1})
    console.log(1)
  }
})

myProxy.start()
