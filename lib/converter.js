module.exports = class Converter {

    /**
     * 
     * @param {*} type 
     * @param {function(string)} handler 
     */
    constructor(type, handler) {

        if (!type) throw new Error('Converter must have `type`');
        if (!handler) throw new Error('Converter must have `handler`');
        if (typeof handler !== 'function') throw new Error('Handler must be a function');

        this.type    = type;
        this.handler = handler;
    }

    /**
     * Converts a string value to type
     * @param {string} value 
     */
    convert(value) {
        return this.handler(value);
    }

}