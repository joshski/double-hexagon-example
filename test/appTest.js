const assert = require('assert')
const appFactories = require('./support/appFactories')

appFactories.forEach(function(appFactory) {

  describe(appFactory.describeApp(), function () {

    let app, client

    beforeEach(async function () {
      app = appFactory.createApp()
      client = await app.createClient()
    })

    afterEach(async function () {
      await app.stop()
    })

    describe('making a transfer', function () {

      let sender, receiver

      beforeEach(async function () {
        sender = await client.createAccount()
        receiver = await client.createAccount()
      })

      async function makeTransfer () {
        await sender.deposit(123.45)
        await sender.transferTo(receiver, 12.34)
      }

      it('decreases the balance of the sender account', async function () {
        await makeTransfer()
        assert.equal(await sender.getBalance(), 111.11)
      })

      it('increases the balance of the receiver account', async function () {
        await makeTransfer()
        assert.equal(await receiver.getBalance(), 12.34)
      })
    })

  })

})
