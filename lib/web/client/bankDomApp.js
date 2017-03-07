const hyperdom = require('hyperdom')
const h = hyperdom.html

class BankDomApp {
  constructor(element, apiClient) {
    hyperdom.append(element, new HyperdomApp(apiClient))
  }
}

class HyperdomApp {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  render() {
    return h('.app',
      h('a.home', {
        href: '#home',
        onclick: e => {
          delete this.currentAccount
          e.preventDefault()
        }
      }, 'Bank Home'),
      h('.create-account',
        h('button', {
          onclick: async () => {
            this.currentAccount = await this.apiClient.createAccount()
          }
        }, 'Create Account')
      ),
      h('.open-account',
        h('input.account-to-open', { binding: [this, 'accountToOpen'] }),
        h('button', {
          onclick: async () => {
            this.currentAccount = await this.apiClient.getAccount(this.accountToOpen)
            this.accountToOpen = ''
          }
        }, 'Open Account')
      ),
      h('.current-account',
        this.currentAccount ? this.renderCurrentAccount() : h('.no-current-account')
      )
    )
  }

  renderCurrentAccount() {
    const account = this.currentAccount
    return [
      h('h2', 'Account ', h('span.account-number', account.accountNumber)),
      h('.balance', 'Balance: ', h('span.account-balance', account.balance)),
      h('.deposit',
        h('input.amount', { binding: [this, 'depositAmount'] }),
        h('button', {
          onclick: async () => {
            await account.deposit(this.depositAmount)
            this.depositAmount = ''
          }
        }, 'Deposit')
      ),
      h('.transfer',
        'Transfer ',
        h('input.amount', { binding: [this, 'transferAmount'] }),
        ' to account number ',
        h('input.other-account', { binding: [this, 'transferToAccount'] }),
        h('button', {
          onclick: async () => {
            const otherAccount = await this.apiClient.getAccount(this.transferToAccount)
            await account.transferTo(otherAccount, this.transferAmount)
            this.transferAmount = ''
            this.transferToAccount = ''
          }
        }, 'Send')
      )
    ]
  }
}

module.exports = BankDomApp
