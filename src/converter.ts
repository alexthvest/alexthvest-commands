export abstract class Converter {
  public abstract type
  public abstract convert(value: string): ConverterResult
}

interface ConverterResult {
  error?: string
  value?: any
}