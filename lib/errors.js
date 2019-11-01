class AccessError extends Error {}
class ParametersCountMistmatch extends Error {}
class ParamsError extends Error {}
class ConverterNotFoundError extends Error {}
class ValidationError extends Error {}

module.exports = {
    AccessError,
    ParametersCountMistmatch,
    ParamsError,
    ConverterNotFoundError,
    ValidationError
};