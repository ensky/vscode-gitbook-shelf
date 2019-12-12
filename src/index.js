const Gitbook = require('./gitbook')

const extension = new Gitbook()

module.exports = {
  activate: extension.activate.bind(extension),
  deactivate: extension.deactivate.bind(extension)
}
