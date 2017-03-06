const BankApp = require('../../lib/app/bankApp')
const BankServer = require('../../lib/web/server/BankServer')
const BankApiClient = require('./clients/bankApiClient')
const MemoryAccountStore = require('../../lib/stores/accounts/memoryAccountStore')
const FlatFileAccountStore = require('../../lib/stores/accounts/flatFileAccountStore')

class AppFactory {
  constructor(options) {
    this.options = options
  }

  describeApp() {
    const components = Object.keys(this.options.components).map(
      name => this.options.components[name].name
    ).join(', ')
    return `${this.options.type.name} (${components})`
  }

  createApp() {
    const AppConfiguration = this.options.type
    const components = {}
    Object.keys(this.options.components).forEach(name => {
      const Component = this.options.components[name]
      components[name] = new Component()
    })
    return new AppConfiguration(components)
  }
}

class AppConfiguration {
  constructor(components) {
    this.components = components
  }
}

class AppCore extends AppConfiguration {
  async createClient() {
    this.app = new BankApp(this.components)
    await this.app.start()
    return this.app
  }
  async stop() {
    await this.app.stop()
  }
}

class AppViaApi extends AppConfiguration {
  async createClient() {
    this.app = new BankApp(this.components)
    await this.app.start()
    this.server = new BankServer(this.app)
    await this.server.start(6661)
    return new BankApiClient(this.server.url)
  }
  async stop() {
    await this.app.stop()
    await this.server.stop()
  }
}

const appFactories = [
  { type: AppCore,   components: { accountStore: MemoryAccountStore } },
  { type: AppCore,   components: { accountStore: FlatFileAccountStore } },
  { type: AppViaApi, components: { accountStore: MemoryAccountStore } },
  { type: AppViaApi, components: { accountStore: FlatFileAccountStore } }
].map(options => new AppFactory(options))

module.exports = appFactories
