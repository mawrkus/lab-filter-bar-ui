import { copy } from 'fastest-json-copy';

export class StateMachineContext {
  /**
   * @param {Object} initialValue
   */
  constructor(initialValue) {
    this._value = { ...initialValue };
    this._updateHandlers = [];
  }

  /**
   * @return {Object}
   */
  get() {
    return this._value;
  }

  /**
   * @param {Object} newValue
   */
  set(newValue) {
    this._value = copy(newValue);

    this._updateHandlers.forEach((h) => h(this._value));
  }

  /**
   * @param {Function} handler
   */
  onUpdate(handler) {
    if (!this._updateHandlers.find((h) => h === handler)) {
      this._updateHandlers.push(handler);
    }
  }
}
