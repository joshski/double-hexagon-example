class MemoryAccountStore {
  constructor() {
    this.accounts = {}
  }

  async createAccount(account) {
    account.accountNumber = Object.keys(this.accounts).length + 1
    await this.storeAccount(account)
  }

  async storeAccount(account) {
    this.accounts[account.accountNumber] = clone(account)
  }

  async getAccount(accountNumber) {
    return clone(this.accounts[accountNumber])
  }
}

function clone(object) {
  return JSON.parse(JSON.stringify(object))
}

module.exports = MemoryAccountStore
