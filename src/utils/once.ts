export const once = (f: (...args: any[]) => any) => {
  let called = false

  return (...args: any[]) => {
    if (called) {
      return
    }
    called = true
    return f.apply(null, args)
  }
}
