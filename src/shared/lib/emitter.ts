export class Emitter<T = unknown> {
  private readonly subscriberMap = new Map<string, (value: T) => void>()

  subscribe(callback: (value: T) => void) {
    const callbackKey = callback.toString()
    if (this.subscriberMap.has(callbackKey)) return

    this.subscriberMap.set(callbackKey, callback)

    return () => this.subscriberMap.delete(callbackKey)
  }

  emitNextValue(value: T) {
    this.subscriberMap.forEach(callback => callback(value))
  }
}
