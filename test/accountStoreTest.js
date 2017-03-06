const FlatFileAccountStore = require('../lib/stores/accounts/flatFileAccountStore')
const MemoryAccountStore = require('../lib/stores/accounts/memoryAccountStore')
const assert = require('assert')

const stores = [MemoryAccountStore, FlatFileAccountStore]

stores.forEach(function(Store) {

  describe(`AccountStore (${Store.name})`, function() {

    let store

    beforeEach(async function() {
      store = new Store()
      if (store.start) { await store.start() }
    })

    afterEach(async function() {
      if (store.stop) { await store.stop() }
    })

    it('assigns accountNumbers when creating accounts', async function () {
      const account1 = { balance: 123 }
      const account2 = { balance: 456 }
      await store.createAccount(account1)
      await store.createAccount(account2)
      assert.equal(account1.accountNumber, 1)
      assert.equal(account2.accountNumber, 2)
    })

    it('stores and retrieves accounts', async function () {
      const account1 = { accountNumber: 1, balance: 0 }
      const account2 = { accountNumber: 2, balance: 123 }
      await store.storeAccount(account1)
      const retrieved1 = await store.getAccount(1)
      await store.storeAccount(account2)
      const retrieved2 = await store.getAccount(2)
      assert.deepEqual(retrieved1, account1)
      assert.deepEqual(retrieved2, account2)
    })

    it('gets different account objects for the same account number', async function () {
      await store.storeAccount({ accountNumber: 1, balance: 0 })
      const retrieved1 = await store.getAccount(1)
      const retrieved2 = await store.getAccount(1)
      retrieved1.balance = 666
      assert.equal(retrieved2.balance, 0)
    })

    it('stores copies of accounts', async function () {
      const account = { accountNumber: 1, balance: 0 }
      await store.storeAccount(account)
      account.balance = 666
      const retrieved = await store.getAccount(1)
      assert.equal(retrieved.balance, 0)
    })

  })

})
