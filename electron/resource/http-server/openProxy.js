const MiniProxy = require('./cors-http');

// var myProxy = new MiniProxy({
//   'port': 9394,
//   serverPort: 60447,
//   youtubeProxyPort: 60447,
//   'onBeforeRequest': function (requestOptions) {
//     console.log('proxy request : ' + (new Date()).toLocaleString() + '|' + (requestOptions.requestAddress || '') + '|' + (requestOptions.path || '') + '|' + (requestOptions.port || ''))
//   }
// })

// myProxy.start()

process.on('message', (m) => {
  const config = m.open
  if (config) {
    var myProxy = new MiniProxy({
      'port': config.port,
      proxyUrl: config.proxyUrl,
      'onBeforeRequest': function (requestOptions) {
        console.log('proxy request : ' + (new Date()).toLocaleString() + '|' + (requestOptions.requestAddress || '') + '|' + (requestOptions.path || '') + '|' + (requestOptions.port || ''))
      },
      'onServerError': function (e) {
        process.send({ error: e.message })
      },
      'onListening': function () {
        process.send({success: 1})
      }
    })

    myProxy.start()
  }
})
