class AccessError extends Error {}
class ParametersCountMismatch extends Error {}
class ParamsError extends Error {}
class ConverterNotFoundError extends Error {}
class ValidationError extends Error {}

module.exports = {
  AccessError,
  ParametersCountMismatch,
  ParamsError,
  ConverterNotFoundError,
  ValidationError
}