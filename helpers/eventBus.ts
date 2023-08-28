const events = reactive({})

export const emit = (event: string, data?: any): void => {
  // @ts-ignore
  (events[event] || []).forEach((fn: Function) => fn(data))
}
export const subscribe = (event: string, cb: Function) => {
  // @ts-ignore
  (events[event] || (events[event] = [])).push(cb)
  // @ts-ignore
  return () => events[event] && events[event].splice(events[event].indexOf(cb) >>> 0, 1)
}
