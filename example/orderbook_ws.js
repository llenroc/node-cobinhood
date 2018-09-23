const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.on('open', () => {
  console.error('open')
  client.subscribeOrderbook('BTC-USDT', '1E-1', (msg) => console.log('on msg', msg))
  .then(() => {
    console.error('subscribe')
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
client.on('error', (msg) => console.error('on error', msg))
