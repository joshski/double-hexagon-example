const fs = require('fs')
const path = require('path')

class FlatFileAccountStore {
  constructor() {
    this.path = path.join(process.cwd(), 'accounts.json')
  }

  async start() {
    await this.writeAccounts({})
  }

  async stop() {
    await this.clearAccounts()
  }

  async createAccount(account) {
    const accounts = await this.readAccounts()
    account.accountNumber = Object.keys(accounts).length + 1
    await this.storeAccount(account)
  }

  async storeAccount(account) {
    const accounts = await this.readAccounts()
    accounts[account.accountNumber] = clone(account)
    await this.writeAccounts(accounts)
  }

  async getAccount(accountNumber) {
    const accounts = await this.readAccounts()
    return accounts[accountNumber]
  }

  async writeAccounts(accounts) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(accounts), function(error) {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async readAccounts() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', function(error, contents) {
        if (error) {
          reject(error)
        } else {
          let parsed
          try {
            parsed = JSON.parse(contents)
          } catch (e) {
            return reject(e)
          }
          resolve(parsed)
        }
      })
    })
  }

  clearAccounts() {
    return new Promise((resolve, reject) => {
      fs.unlink(this.path, function(error) {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}

function clone(account) {
  return { accountNumber: account.accountNumber, balance: account.balance }
}

module.exports = FlatFileAccountStore
