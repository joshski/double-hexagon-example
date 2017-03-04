function bankRoutes(routes, bankApp) {
  routes.putAsync('/accounts', async (request, response) => {
    const account = await bankApp.openAccount()
    response.status(201).location(`/accounts/${account.accountNumber}/`).end()
  })
  routes.getAsync('/accounts/:accountNumber', async (request, response) => {
    const accountNumber = request.params.accountNumber
    const account = await bankApp.getAccount(accountNumber)
    response.json({ accountNumber })
  })
  routes.putAsync('/accounts/:accountNumber/deposits', async (request, response) => {
    const account = await bankApp.getAccount(request.params.accountNumber)
    await account.deposit(request.body.amount)
    response.sendStatus(201)
  })
  routes.getAsync('/accounts/:accountNumber/balance', async (request, response) => {
    const account = await bankApp.getAccount(request.params.accountNumber)
    response.json({ balance: account.balance })
  })
  routes.putAsync('/accounts/:accountNumber/transfers/:otherAccountNumber', async (request, response) => {
    const account = await bankApp.getAccount(request.params.accountNumber)
    const otherAccount = await bankApp.getAccount(request.params.otherAccountNumber)
    await account.transferTo(otherAccount, request.body.amount)
    response.sendStatus(201)
  })
}

module.exports = bankRoutes
