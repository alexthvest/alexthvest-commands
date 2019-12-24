const Converter = require('../converter')

module.exports = class BooleanConverter extends Converter {
  type = Boolean
  
  convert(value) {
    const result = {
      error: `Cannot convert \`${value}\` to boolean`,
      value: null
    }
  
    if (value.toLowerCase() === 'true' || value === '1') result.value = true
    if (value.toLowerCase() === 'false' || value === '0') result.value = false
    if (result.value !== null) result.error = null
  
    return result
  }
}