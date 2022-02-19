export class StateMachineContext {
  /**
   * @param {Object} initialValue
   */
  constructor(initialValue) {
    this._value = { ...initialValue };
    this._updateHandler = null;
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
    this._value = newValue;

    if (this._updateHandler) {
      this._updateHandler(this._value);
    }
  }

  /**
   * @param {Function} handler
   */
  onUpdate(handler) {
    this._updateHandler = handler;
  }
}
