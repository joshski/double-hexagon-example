const BankApp = require('../../lib/app/bankApp')
const BankServer = require('../../lib/web/server/BankServer')
const BankApiClient = require('./clients/bankApiClient')
const MemoryAccountStore = require('../../lib/stores/accounts/memoryAccountStore')

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

  async createApp() {
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

class Core extends AppConfiguration {
  async createClient() {
    this.app = new BankApp(this.components)
    await this.app.start()
    return this.app
  }
  async stop() {
    await this.app.stop()
  }
}

class Api extends AppConfiguration {
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
  { type: Core, components: { accountStore: MemoryAccountStore } },
  { type: Api,  components: { accountStore: MemoryAccountStore } }
].map(options => new AppFactory(options))

module.exports = appFactories
