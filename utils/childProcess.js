function waitForChildProcessClose (cp) {
  return new Promise((resolve, reject) => {
    cp.on('close', (code) => {
      resolve(code)
    })
    cp.on('error', e => {
      reject(e)
    })
    cp.kill()
  })
}

module.exports = {
  waitForChildProcessClose
}
