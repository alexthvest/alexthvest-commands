export async function validationMiddleware(ctx, next: () => void) {
  if (typeof ctx.command.validate !== 'function') return next()
  const result = await ctx.command.validate(ctx.args, ctx.ctx)

  if (typeof result === 'string') throw new Error(result)
  if (!result) return

  await next()
}

export async function accessMiddleware(ctx, next: () => void) {
  if (typeof ctx.command.access !== 'function') return next()
  const result = await ctx.command.access(ctx.args, ctx.ctx)

  if (typeof result === 'string') throw new Error(result)
  if (!result) throw new Error('Access denied')

  await next()
}