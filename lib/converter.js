module.exports = class Converter {
  /**
   * Type of result
   */
  type = null
  
  /**
   * @typedef {object} ConverterResult
   * @property {string} [error]
   * @property {*} [value]
   */
  
  /**
   * Converts string {value} to a {type}
   * @param {string} value
   * @returns {ConverterResult}
   */
  convert(value) {
    return {}
  }
}