export type SetRecordValues<T, Values> = {
  [K in keyof T]: Values
}
