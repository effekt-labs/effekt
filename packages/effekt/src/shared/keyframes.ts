import { isNumber } from './is'
import { rgxPxAll, rgxDegTransform } from './regex'

export const setUnit = (
  key: string,
  value: number | string,
  prop?: string,
): string => {
  let unit = isNumber(value)
    ? (rgxPxAll.test(key) && 'px') || (rgxDegTransform.test(key) && 'deg') || ''
    : ''
  return prop === 'transform' ? `${key}(${value}${unit})` : `${value}${unit}`
}
