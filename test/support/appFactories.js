const http = require('httpism')
const ajax = require('httpism/browser')
const BankApp = require('../../lib/app/bankApp')
const BankServer = require('../../lib/web/server/bankServer')
const BankDomApp = require('../../lib/web/client/bankDomApp')
const BankApiClient = require('./clients/bankApiClient')
const BankDomClient = require('./clients/bankDomClient')
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
    return new BankApiClient(http, this.server.url)
  }
  async stop() {
    await this.app.stop()
    await this.server.stop()
  }
}

class AppViaDom extends AppConfiguration {
  async createClient() {
    this.app = new BankApp(this.components)
    await this.app.start()
    this.server = new BankServer(this.app)
    await this.server.start(6662)
    this.apiClient = new BankApiClient(ajax, this.server.url)
    this.element = document.createElement('div')
    document.body.appendChild(this.element)
    this.domApp = new BankDomApp(this.element, this.apiClient)
    return new BankDomClient(this.element)
  }
  async stop() {
    await this.server.stop()
    await this.app.stop()
  }
}

const appConfigurations = [
  { type: AppCore,   components: { accountStore: MemoryAccountStore } },
  { type: AppCore,   components: { accountStore: FlatFileAccountStore } },
  { type: AppViaApi, components: { accountStore: MemoryAccountStore } },
  { type: AppViaApi, components: { accountStore: FlatFileAccountStore } }
]

if (typeof window !== 'undefined') {
  appConfigurations.push({ type: AppViaDom, components: { accountStore: MemoryAccountStore } })
  appConfigurations.push({ type: AppViaDom, components: { accountStore: FlatFileAccountStore } })
}

appFactories = appConfigurations.map(options => new AppFactory(options))

module.exports = appFactories
