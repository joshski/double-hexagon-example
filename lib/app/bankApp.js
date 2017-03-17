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

  async createAccount() {
    const domainAccount = new Account({})
    await this.accountStore.createAccount(domainAccount)
    return new StoredAccount(domainAccount, this.accountStore)
  }

  async getAccount(accountNumber) {
    return new StoredAccount(
      new Account(await this.accountStore.getAccount(accountNumber)),
      this.accountStore
    )
  }
}

class StoredAccount {
  constructor(domainAccount, store) {
    this.accountNumber = domainAccount.accountNumber
    this.balance = domainAccount.balance
    this.domainAccount = domainAccount
    this.store = store
  }

  async deposit(amount) {
    this.domainAccount.deposit(amount)
    await this.store.storeAccount(this.domainAccount)
  }

  async transferTo(otherAccount, amount) {
    this.domainAccount.transferTo(otherAccount.domainAccount, amount)
    await this.store.storeAccount(this.domainAccount)
    await this.store.storeAccount(otherAccount.domainAccount)
  }

  async getBalance() {
    const domainAccount = await this.store.getAccount(this.accountNumber)
    return domainAccount.balance
  }
}

module.exports = BankApp
