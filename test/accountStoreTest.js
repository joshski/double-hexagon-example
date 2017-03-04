const MemoryAccountStore = require('../lib/stores/accounts/memoryAccountStore')
const assert = require('assert')

const stores = [MemoryAccountStore]

stores.forEach(function(Store) {

  describe(Store.name, function() {

    let store

    beforeEach(function() {
      store = new Store()
    })

    it('stores and retrieves accounts', async function () {
      const account1 = { accountNumber: 1, balance: 0 }
      const account2 = { accountNumber: 2, balance: 123 }
      await store.storeAccount(account1)
      await store.storeAccount(account2)
      const retrieved1 = await store.getAccount(1)
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
