const express = require('express')
const bodyParser = require('body-parser')
const asyncify = require('./asyncify')
const bankRoutes = require('./bankRoutes')

class BankServer {
  constructor(bankApp) {
    this.bankApp = bankApp
    this.expressApp = asyncify(express())
    this.expressApp.use(bodyParser.json())
    bankRoutes(this.expressApp, this.bankApp)
  }

  start(port) {
    return new Promise((resolve, reject) => {
      this.httpServer = this.expressApp.listen(port, error => {
        if (error) {
          reject(error)
        } else {
          this.url = `http://localhost:${port}`
          resolve()
        }
      })
      this.httpServer.on('connection', function(socket) {
        socket.setTimeout(10)
      })
    })
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.httpServer.close(error => {
        if (error) {
          reject(error)
        } else {
          delete this.url
          resolve()
        }
      })
    })
  }
}

module.exports = BankServer
