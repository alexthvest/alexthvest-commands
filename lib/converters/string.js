const Converter = require('../converter')

module.exports = class NumberConverter extends Converter {
  type = String
  
  convert(value) {
    return {value}
  }
}