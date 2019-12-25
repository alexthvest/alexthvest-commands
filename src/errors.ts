export class ParametersCountMismatchError extends Error {
  constructor() {
    super('Parameters count mismatch');
  }
}

export class NoConverterForTypeError extends Error {
  constructor(type) {
    super(`No such converter for type ${type.name || ''}`.trim());
  }
}

export class ConvertError extends Error {

}

export class TooManyRestParametersError extends Error {
  constructor() {
    super('Too many rest parameters');
  }
}