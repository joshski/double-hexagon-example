const http = require('httpism')

class BankApiClient {
  constructor(bankServerUrl) {
    this.api = http.api(bankServerUrl)
  }

  async openAccount() {
    const response = await this.api.put('accounts')
    return new AccountApiClient(await this.api.get(response.headers.location))
  }
}

class AccountApiClient {
  constructor(api) {
    this.api = api
    this.accountNumber = api.body.accountNumber
  }

  async deposit(amount) {
    await this.api.put('deposits', { amount })
  }

  async transferTo(otherAccount, amount) {
    await this.api.put(`transfers/${otherAccount.accountNumber}`, { amount })
  }

  async getBalance() {
    return (await this.api.get('balance')).body.balance
  }
}

module.exports = BankApiClient
