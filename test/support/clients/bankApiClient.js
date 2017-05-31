class BankApiClient {
  constructor(http, bankServerUrl) {
    this.httpClient = http.client(bankServerUrl)
  }

  async createAccount() {
    const response = await this.httpClient.put('accounts', {}, { response: true })
    return await this._createAccountClient(response.headers.location)
  }

  async getAccount(accountNumber) {
    return await this._createAccountClient(`accounts/${accountNumber}/`)
  }

  async _createAccountClient(accountUrl) {
    const response = await this.httpClient.get(accountUrl)
    return new AccountApiClient(this.httpClient.client(accountUrl), response.accountNumber, response.balance)
  }
}

class AccountApiClient {
  constructor(httpClient, accountNumber, balance) {
    this.httpClient = httpClient
    this.accountNumber = accountNumber
    this.balance = balance
  }

  async deposit(amount) {
    await this.httpClient.put('deposits', { amount })
  }

  async transferTo(otherAccount, amount) {
    await this.httpClient.put(`transfers/${otherAccount.accountNumber}`, { amount })
  }

  async getBalance() {
    return (await this.httpClient.get('balance')).balance
  }
}

module.exports = BankApiClient
