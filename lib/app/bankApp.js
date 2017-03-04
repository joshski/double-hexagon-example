const Account = require('../domain/account')

class BankApp {
  constructor({ accountStore }) {
    this.accountStore = accountStore
  }

  components() {
    return [this.accountStore]
  }

  async start() {
    await Promise.all(this.components().map(async component => {
      if (component.start) await component.start()
    }))
  }

  async stop() {
    await Promise.all(this.components().map(async component => {
      if (component.stop) await component.stop()
    }))
  }

  async openAccount() {
    const account = new StoredAccount({}, this.accountStore)
    await this.accountStore.createAccount(account)
    return account
  }

  async getAccount(accountNumber) {
    return new StoredAccount(
      await this.accountStore.getAccount(accountNumber),
      this.accountStore
    )
  }
}

class StoredAccount extends Account {
  constructor(data, store) {
    super(data)
    this.store = store
  }

  async deposit(amount) {
    super.deposit(amount)
    await this.store.storeAccount(this)
  }

  async transferTo(otherAccount, amount) {
    super.transferTo(otherAccount, amount)
    await this.store.storeAccount(this)
  }
}

module.exports = BankApp
