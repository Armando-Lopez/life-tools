export const normalizeString = (string: string, functions: Array<string> = []): string => {
  let result = string.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
  functions.forEach((functionToApply) => {
    const [functionName, ...args] = functionToApply.split('|')
    // @ts-ignore
    result = String.prototype[functionName].apply(result, [...args])
  })
  return result
}
