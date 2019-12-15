class Converter {
  #handler
  
  /**
   * @typedef {object} ConverterResult
   * @property {string} [error]
   * @property [value]
   */
  
  /**
   * @callback ConverterCallback
   * @param {string} value
   * @param context
   * @returns {ConverterResult}
   */
  
  /**
   * @param type
   * @param {ConverterCallback} handler
   */
  constructor(type, handler) {
    this.type = type
    this.#handler = handler
  }
  
  /**
   * Converts a string value to type
   * @param {string} value
   * @param context
   */
  convert(value, context) {
    if (!this.type) throw new Error('Converter must have `type`')
    if (!this.#handler) throw new Error('Converter must have `handler`')
    if (typeof this.#handler !== 'function') throw new Error('Handler must be a function')
    
    return this.#handler(value, context)
  }
  
}

module.exports = Converter