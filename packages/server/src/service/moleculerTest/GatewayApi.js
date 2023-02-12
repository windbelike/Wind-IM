const { ServiceBroker } = require('moleculer')
const ApiService = require('moleculer-web')

const broker = new ServiceBroker({ logger: console })

// Create a service
broker.createService({
  name: 'test',
  actions: {
    hello () {
      return 'Hello API Gateway!'
    }
  }
})

// Load API Gateway
broker.createService({
  mixins: [ApiService],
  settings: {
    port: 8080
  }
})

// Start server
broker.start()
