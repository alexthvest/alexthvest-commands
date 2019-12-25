import { Converter, ConverterResult } from '../converter'

export class StringConverter extends Converter {
  type = String

  convert(value: string): ConverterResult {
    return { value };
  }
}

export class NumberConverter extends Converter {
  type = Number

  convert(value: string): ConverterResult {
    const result = {
      error: `Unable to convert ${value} to a number`,
      value: parseFloat(value)
    }

    if (!Number.isNaN(result.value))
      result.error = null

    return result
  }
}

export class BooleanConverter extends Converter {
  type = Boolean

  convert(value: string): ConverterResult {
    const result = {
      error: `Unable to convert ${value} to a boolean`,
      value: null
    }

    if (value.toLowerCase() === 'true' || value === '1') result.value = true
    if (value.toLowerCase() === 'false' || value === '0') result.value = false
    if (result.value !== null) result.error = null

    return result
  }
}