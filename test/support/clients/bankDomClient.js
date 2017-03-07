const browserMonkey = require('browser-monkey')

class BankDomClient {
  constructor(element) {
    this.monkey = browserMonkey.scope(element)
  }

  async createAccount() {
    await this.monkey.click('Bank Home')
    await this.monkey.find('.no-current-account').shouldExist()
    await this.monkey.click('Create Account')
    const accountNumberElement = (await this.monkey.find('.current-account .account-number').elements())[0]
    const accountNumber = accountNumberElement.innerText
    return new AccountComponent(this.monkey, accountNumber)
  }
}

class AccountComponent {
  constructor(monkey, accountNumber) {
    this.monkey = monkey
    this.accountNumber = accountNumber
  }

  async visitAccount() {
    await this.monkey.click('Bank Home')
    await this.monkey.find('.no-current-account').shouldExist()
    await this.monkey.find('.account-to-open').typeIn(this.accountNumber)
    await this.monkey.click('Open Account')
  }

  async deposit(amount) {
    await this.visitAccount()
    await this.monkey.find('.deposit .amount').typeIn(amount.toString())
    await this.monkey.click('Deposit')
  }

  async transferTo(otherAccount, amount) {
    await this.visitAccount()
    await this.monkey.find('.transfer .other-account').typeIn(otherAccount.accountNumber.toString())
    await this.monkey.find('.transfer .amount').typeIn(amount.toString())
    await this.monkey.find('.transfer').click('Send')
  }

  async getBalance() {
    await this.visitAccount()
    return Number((await this.monkey.find('.account-balance').elements())[0].innerText)
  }
}

module.exports = BankDomClient
