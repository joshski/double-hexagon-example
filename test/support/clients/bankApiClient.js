class BankApiClient {
  constructor(http, bankServerUrl) {
    this.api = http.api(bankServerUrl)
  }

  async createAccount() {
    const response = await this.api.put('accounts')
    return new AccountApiClient(await this.api.get(response.headers.location))
  }

  async getAccount(accountNumber) {
    return new AccountApiClient(await this.api.get(`accounts/${accountNumber}/`))
  }
}

class AccountApiClient {
  constructor(api) {
    this.api = api
    this.accountNumber = api.body.accountNumber
    this.balance = api.body.balance
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
