export abstract class Converter {
  public abstract type
  public abstract convert(value: string, ctx: any): ConverterResult
}

export interface ConverterResult {
  error?: string
  value?: any
}