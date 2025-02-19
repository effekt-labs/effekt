// Inspired by Hypernym Utils, v3.4.1, MIT License, https://github.com/hypernym-studio/utils

export const noop = (): void => {}

export const isBrowser: boolean = typeof window !== 'undefined'

export const isNumber = (v: any): v is number =>
  typeof v === 'number' && !isNaN(v)

export const isString = (v: any): v is string => typeof v === 'string'

export const isObject = (v: any): v is object =>
  Object.prototype.toString.call(v).slice(8, -1) === 'Object'

export const isArray = (v: any): v is any[] => Array.isArray(v)

export const isFunction = (v: any): v is (...args: any[]) => unknown =>
  v instanceof Function

export const isElement = (v: any): v is Element => v instanceof Element

export const isUndefined = (v: any): v is undefined => typeof v === 'undefined'
