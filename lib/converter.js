class Converter {

    /**
     * 
     * @param {*} type 
     * @param {function(string)} handler 
     * @constructor
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
     * @public 
     */
    convert(value) {
        return this.handler(value);
    }

}

Converter.String = new Converter(String, value => value);
Converter.Number = new Converter(Number, value => {
    const number = parseFloat(value);
    if (Number.isNaN(number)) throw new Error(`Cannot convert \`${value}\` to number`);
    return number;
});
Converter.Boolean = new Converter(Boolean, value => {
    if (value.toLowerCase() == 'true' || value == '1') return true;
    if (value.toLowerCase() == 'false' || value == '0') return false;
    throw new Error(`Cannot convert \`${value}\` to boolean`);
});

module.exports = Converter;