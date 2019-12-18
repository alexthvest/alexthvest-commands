module.exports = class Command {

  /**
   *
   * @param {string | RegExp} command
   * @param {object} options
   * @param {string[] | RegExp[]} [options.aliases]
   * @param {object} [options.params]
   * @param {function(object, object)} [options.execute]
   * @param {function(object)} [options.access]
   * @param {function(object, object)} [options.validate]
   * @param {Command[]} [options.commands]
   */
  constructor(command, options) {
    options = options || {}

    this.execute = options.execute || null
    this.access = options.access || null
    this.validate = options.validate || null
    this.aliases = [command, ...(options.aliases || [])]
    this.params = options.params || {}
    this.commands = options.commands || []

  }
}