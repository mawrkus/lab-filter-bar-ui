export class StateMachineContext {
  /**
   * @param {Object} options
   * @param {Object} options.initialValue
   */
  constructor({ initialValue }) {
    this._context = initialValue;
    this._updateHandler = null;
  }

  /**
   * @param {Function} handler
   */
  onUpdate(handler) {
    this._updateHandler = handler;
  }

  /**
   * @param {Object} newContext
   */
  set(newContext) {
    this._context = newContext;

    if (this._updateHandler) {
      this._updateHandler(this._context);
    }
  }

  /**
   * @return {Object}
   */
  get() {
    return this._context;
  }
}
