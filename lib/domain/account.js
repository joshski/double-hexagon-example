class Account {
  constructor(data = {}) {
    this.balance = data.balance || 0
    this.accountNumber = data.accountNumber
  }

  deposit(amount) {
    this.balance += amount
  }

  transferTo(otherAccount, amount) {
    this.deposit(-amount)
    otherAccount.deposit(amount)
  }

  getBalance() {
    return this.balance
  }
}

module.exports = Account
