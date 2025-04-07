import type { AnimationOptions } from '../options'
import type { AnimationEffect } from '../effect'

export type KeyframeValue = number | string
export type KeyframeArrayValue = [
  KeyframeValue,
  KeyframeValue,
  ...KeyframeValue[],
]
export type KeyframeObjectValue = Omit<AnimationEffect, 'timeline'> & {
  value: number | string | KeyframeArrayValue
  offset?: AnimationOptions['offset']
}
export type KeyframeValues =
  | number
  | string
  | KeyframeArrayValue
  | KeyframeObjectValue

export interface OtherKeyframes {
  opacity?: KeyframeValues
  fillOpacity?: KeyframeValues
  width?: KeyframeValues
  minWidth?: KeyframeValues
  maxWidth?: KeyframeValues
  height?: KeyframeValues
  minHeight?: KeyframeValues
  maxHeight?: KeyframeValues
  margin?: KeyframeValues
  marginTop?: KeyframeValues
  marginRight?: KeyframeValues
  marginBottom?: KeyframeValues
  marginLeft?: KeyframeValues
  padding?: KeyframeValues
  paddingTop?: KeyframeValues
  paddingRight?: KeyframeValues
  paddingBottom?: KeyframeValues
  paddingLeft?: KeyframeValues
  inset?: KeyframeValues
  top?: KeyframeValues
  right?: KeyframeValues
  bottom?: KeyframeValues
  left?: KeyframeValues
  fontSize?: KeyframeValues
  lineHeight?: KeyframeValues
  letterSpacing?: KeyframeValues
  borderRadius?: KeyframeValues
  borderWidth?: KeyframeValues
  filter?: KeyframeValues
  outlineOffset?: KeyframeValues
  outlineWidth?: KeyframeValues
  strokeWidth?: KeyframeValues
  strokeOpacity?: KeyframeValues
  strokeDashoffset?: KeyframeValues
  strokeDasharray?: KeyframeValues
  offsetAnchor?: KeyframeValues
  offsetDistance?: KeyframeValues
  offsetPath?: KeyframeValues
  offsetPosition?: KeyframeValues
  offsetRotate?: KeyframeValues
  cx?: KeyframeValues
  cy?: KeyframeValues
  d?: KeyframeValues
  r?: KeyframeValues
  rx?: KeyframeValues
  ry?: KeyframeValues
  clipPath?: KeyframeValues
}

export type TransformValue = number | string
export type TransformArrayValue = [
  TransformValue,
  TransformValue,
  ...TransformValue[],
]
export type TransformObjectValue = Omit<AnimationEffect, 'timeline'> & {
  value: number | string | TransformArrayValue
  offset?: AnimationOptions['offset']
}
export type TransformValues =
  | number
  | string
  | TransformArrayValue
  | TransformObjectValue

export interface TransformKeyframes {
  x?: TransformValues
  y?: TransformValues
  z?: TransformValues
  translate?: TransformValues
  translateX?: TransformValues
  translateY?: TransformValues
  translateZ?: TransformValues
  translate3d?: TransformValues
  scale?: TransformValues
  scaleX?: TransformValues
  scaleY?: TransformValues
  scaleZ?: TransformValues
  scale3d?: TransformValues
  rotate?: TransformValues
  rotateX?: TransformValues
  rotateY?: TransformValues
  rotateZ?: TransformValues
  rotate3d?: TransformValues
  skew?: TransformValues
  skewX?: TransformValues
  skewY?: TransformValues
  perspective?: TransformValues
  matrix?: TransformValues
  matrix3d?: TransformValues
  transform?: TransformValues
}

export type ColorValue = string
export type ColorArrayValue = [ColorValue, ColorValue, ...ColorValue[]]
export type ColorObjectValue = Omit<AnimationEffect, 'timeline'> & {
  value: string | ColorArrayValue
  offset?: AnimationOptions['offset']
}
export type ColorValues = string | ColorArrayValue | ColorObjectValue

export interface ColorKeyframes {
  color?: ColorValues
  background?: ColorValues
  backgroundColor?: ColorValues
  borderColor?: ColorValues
  borderTopColor?: ColorValues
  borderRightColor?: ColorValues
  borderBottomColor?: ColorValues
  borderLeftColor?: ColorValues
  outlineColor?: ColorValues
  textDecorationColor?: ColorValues
  columnRuleColor?: ColorValues
  accentColor?: ColorValues
  caretColor?: ColorValues
  fill?: ColorValues
  stroke?: ColorValues
}

export type AnimationKeyframes = OtherKeyframes &
  TransformKeyframes &
  ColorKeyframes
