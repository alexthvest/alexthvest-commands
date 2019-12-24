export abstract class Converter {
  public abstract type
  public abstract convert(value: string): ConverterResult
}

export interface ConverterResult {
  error?: string
  value?: any
}