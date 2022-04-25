import { copy } from "fastest-json-copy";
import areEqual from "fast-deep-equal";

export class StateMachineContext {
  /**
   * @param {Object} initialValue
   */
  constructor(initialValue) {
    this._value = initialValue;
    this._updateHandlers = [];
  }

  /**
   * @return {Object}
   */
  get() {
    return copy(this._value); // ensure that any kind of mutation will work
  }

  /**
   * @param {Object} newValue
   */
  set(newValue) {
    if (!areEqual(newValue, this._value)) {
      this._value = newValue;
      this._updateHandlers.forEach((h) => h(newValue));
    }
  }

  /**
   * @param {Function} handler
   */
  onUpdate(handler) {
    if (
      typeof handler === "function" &&
      !this._updateHandlers.find((h) => h === handler)
    ) {
      this._updateHandlers.push(handler);
    }
  }
}
