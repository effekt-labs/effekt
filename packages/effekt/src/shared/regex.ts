export const composeRegex = (...regxs: RegExp[]): RegExp =>
  new RegExp(regxs.map((r) => r.source).join('|'))

export const rgxPxOther =
  /(width|height|margin|padding|inset|top|right|bottom|left)/i
export const rgxPxTransform = /^(x|y|z|translate|perspective)/
export const rgxDegTransform = /^(rotate|skew)/
export const rgxUnitlessTransform = /^scale/
export const rgxPxAll = composeRegex(rgxPxTransform, rgxPxOther)
export const rgxIsTransform = composeRegex(
  rgxPxTransform,
  rgxDegTransform,
  rgxUnitlessTransform,
)
