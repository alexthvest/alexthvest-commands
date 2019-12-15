const Converter = require('../converter')

module.exports = new Converter(Number, value => {
  const result = {
    error: `Cannot convert \`${value}\` to number`,
    value: parseFloat(value)
  }
  
  if (!Number.isNaN(result.value))
    result.error = null
  
  return result
})