export const deepMerge = (target: any, source: any): any => {
  const result = { ...target }

  if (!source) return result

  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}
