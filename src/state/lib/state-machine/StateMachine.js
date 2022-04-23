export class StateMachine {
  /**
   * @param {Object} options
   * @param {string} options.initialStateId
   * @param {StateMachineContext} options.context
   * @param {Object} options.toolkit
   * @param {Object} options.states
   * @param {Function} options.onTransition
   */
  constructor({ initialStateId, context, toolkit, states, onTransition } = {}) {
    this._currentStateId = null;

    this._context = context;

    this._onEntryToolkit = this._buildOnEntryToolkit(toolkit);
    this._onExitToolkit = this._buildCustomToolkit(toolkit);
    this._condToolkit = this._buildCustomToolkit(toolkit);
    this._transitionActionToolkit = this._buildCustomToolkit(toolkit);

    this._states = states;

    this._onTransition = onTransition;
    this._onTransitionContext = this._buildOnTransitionContext();

    const startEvent = { name: "init" };

    this._execTransition(startEvent, {
      fromStateId: null,
      event: startEvent,
      toStateId: initialStateId,
      isValid: typeof this._states[initialStateId] !== "undefined",
    });
  }

  /**
   * @return {Object} context
   */
  _buildOnTransitionContext() {
    return {
      get: this._context.get.bind(this._context),
      set: () => {
        throw new Error(
          "Modifying the context outside of the state machine is prohibited!"
        );
      },
    };
  }

  /**
   * @param {Object} customToolkit
   * @return {Object} toolkit
   */
  _buildCustomToolkit(customToolkit) {
    return {
      ...customToolkit,
    };
  }

  /**
   * @param {Object} customToolkit
   * @return {Object} toolkit
   * @return {Function} toolkit.sendEvent
   */
  _buildOnEntryToolkit(customToolkit) {
    return {
      ...customToolkit,
      sendEvent: this.sendEvent.bind(this),
    };
  }

  /**
   * @param {Object|Null} event null when starting the machine
   * @param {string} event.name
   * @param {Object} event.data
   * @param {Object} transition
   * @param {string} transition.fromStateId
   * @param {Object} transition.event
   * @param {string} transition.event.name
   * @param {Object} transition.event.data
   * @param {string} transition.toStateId
   * @param {boolean} transition.isValid
   */
  _execActions(event, transitionAndAction) {
    const { action, ...transition } = transitionAndAction;

    if (this._onTransition) {
      this._onTransition(transition, this._onTransitionContext);
    }

    if (action) {
      action(event, this._context, this._transitionActionToolkit);
    }

    const previousState = this._states[transition.fromStateId];

    if (previousState?.actions?.onExit) {
      previousState?.actions.onExit(event, this._context, this._onExitToolkit);
    }

    const currentState = this._states[this._currentStateId];

    if (currentState.actions?.onEntry) {
      currentState.actions.onEntry(event, this._context, this._onEntryToolkit);
    }
  }

  /**
   * @param {Object|Null} event null when starting the machine
   * @param {string} [event.name]
   * @param {Object} [event.data]
   * @param {Object} transition
   * @param {string} transition.fromStateId
   * @param {Object} transition.event
   * @param {string} transition.event.name
   * @param {Object} transition.event.data
   * @param {string} transition.toStateId
   * @param {boolean} transition.isValid
   */
  _execTransition(event, transition) {
    if (!transition.isValid) {
      if (this._onTransition) {
        this._onTransition(transition, this._onTransitionContext);
      }

      return;
    }

    this._currentStateId = transition.toStateId;

    this._execActions(event, transition);
  }

  /**
   * @param {Object} event
   * @param {string} event.name
   * @param {Object} event.data
   * @return {Object} transition
   * @return {string} transition.fromStateId
   * @return {Object} transition.event
   * @return {string} transition.event.name
   * @return {Object} transition.event.data
   * @return {string} transition.toStateId
   * @return {boolean} transition.isValid
   */
  _resolveTransition(event) {
    const transition = {
      fromStateId: this._currentStateId,
      event: { ...event },
      toStateId: undefined,
      action: null,
      isValid: false,
    };

    const targetStateDefinition =
      this._states[this._currentStateId].events?.[event.name];

    let targetStateId;
    let action;

    if (typeof targetStateDefinition === "string") {
      targetStateId = targetStateDefinition;
    } else if (typeof targetStateDefinition?.targetId === "string") {
      targetStateId = targetStateDefinition.targetId;
      action = targetStateDefinition.action;
    } else if (Array.isArray(targetStateDefinition)) {
      const match = targetStateDefinition.find(({ cond }) =>
        cond(event, this._context, this._condToolkit)
      );

      targetStateId = match ? match.targetId : undefined;
      action = match ? match.action : undefined;
    }

    transition.toStateId = targetStateId;
    transition.action = action;
    transition.isValid = typeof this._states[targetStateId] !== "undefined";

    return transition;
  }

  /**
   * @return {Object}
   */
  getContext() {
    return this._context;
  }

  /**
   * @return {string}
   */
  getCurrentStateId() {
    return this._currentStateId;
  }

  /**
   * @param {string} eventName
   * @param {Object} eventData
   */
  sendEvent(eventName, eventData) {
    const event = {
      name: eventName,
      data: eventData,
    };

    const transition = this._resolveTransition(event);

    this._execTransition(event, transition);
  }
}
