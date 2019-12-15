const Converter = require('../converter')

module.exports = new Converter(String, value => {
  return { value }
})