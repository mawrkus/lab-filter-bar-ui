import { StateMachine, StateMachineContext } from "..";

const buildMachine = (customOptions) => {
  const { onUpdateContext, ...options } = customOptions;
  const context = new StateMachineContext(customOptions.context);

  context.onUpdate(onUpdateContext);

  const machine = new StateMachine({
    ...options,
    context,
  });

  return {
    machine,
    context,
  };
};

describe("StateMachine({ initialStateId, context, toolkit, states, onTransition })", () => {
  it("should be a class with the following interface: getCurrentStateId(), getContext(), sendEvent(eventName, event)", () => {
    const { machine } = buildMachine({
      initialStateId: "idle",
      states: {
        idle: {},
      },
    });

    expect(machine.getCurrentStateId).toBeInstanceOf(Function);
    expect(machine.getContext).toBeInstanceOf(Function);
    expect(machine.sendEvent).toBeInstanceOf(Function);
  });

  describe("constructor(config)", () => {
    describe("if the initial state has not been defined", () => {
      it('should not transition the machine and should notify the "onTransition" listener', () => {
        const onTransition = jest.fn();

        const { machine } = buildMachine({
          initialStateId: "fetchAttributeSuggestions",
          onTransition,
          states: {
            idle: {},
          },
        });

        const expectedTransition = {
          fromStateId: null,
          event: StateMachine.initEvent,
          toStateId: "fetchAttributeSuggestions",
          isValid: false,
        };

        const expectedContext = {
          get: expect.any(Function),
          set: expect.any(Function),
        };

        expect(onTransition).toHaveBeenCalledWith(
          expectedTransition,
          expectedContext
        );
        expect(machine.getCurrentStateId()).toBe(null);
      });
    });

    describe("otherwise", () => {
      it('should transition the machine to it and notify the "onTransition" listener', () => {
        const onTransition = jest.fn();

        const { machine } = buildMachine({
          initialStateId: "idle",
          onTransition,
          states: {
            idle: {},
          },
        });

        const expectedTransition = {
          fromStateId: null,
          event: StateMachine.initEvent,
          toStateId: "idle",
          isValid: true,
        };

        const expectedContext = {
          get: expect.any(Function),
          set: expect.any(Function),
        };

        expect(onTransition).toHaveBeenCalledWith(
          expectedTransition,
          expectedContext
        );
        expect(machine.getCurrentStateId()).toBe("idle");
      });
    });
  });

  describe("getCurrentStateId()", () => {
    it("should return the current state id", () => {
      const { machine } = buildMachine({
        initialStateId: "idle",
        states: {
          idle: {},
        },
      });

      expect(machine.getCurrentStateId()).toBe("idle");
    });
  });

  describe("getContext()", () => {
    it("should return the current context", () => {
      const initialContext = { partialFilter: null };

      const { machine, context } = buildMachine({
        initialStateId: "idle",
        context: initialContext,
        states: {
          idle: {},
        },
      });

      expect(machine.getContext()).toBe(context);
      expect(machine.getContext().get()).toEqual(initialContext);
    });
  });

  describe("sendEvent(eventName, event)", () => {
    describe("if the event is not supported in the current state", () => {
      it('should not transition the machine and should notify the "onTransition" listener', () => {
        const onTransition = jest.fn();

        const { machine } = buildMachine({
          initialStateId: "idle",
          onTransition,
          states: {
            idle: {
              events: {
                onInputFocus: "fetchAttributeSuggestions",
              },
            },
          },
        });

        machine.sendEvent("onAttributeSelected");

        const expectedTransition = {
          fromStateId: "idle",
          event: { name: "onAttributeSelected", data: undefined },
          toStateId: undefined,
          isValid: false,
        };

        const expectedContext = {
          get: expect.any(Function),
          set: expect.any(Function),
        };

        expect(onTransition).toHaveBeenCalledWith(
          expectedTransition,
          expectedContext
        );
        expect(machine.getCurrentStateId()).toBe("idle");
      });
    });

    describe("if the event is supported in the current state", () => {
      describe("and the associated state does not exist", () => {
        it('should not transition the machine and should notify the "onTransition" listener', () => {
          const onTransition = jest.fn();

          const { machine } = buildMachine({
            initialStateId: "idle",
            onTransition,
            states: {
              idle: {
                events: {
                  onInputFocus: "fetchAttributeSuggestions",
                },
              },
              selectAttribute: {},
            },
          });

          machine.sendEvent("onInputFocus");

          const expectedTransition = {
            fromStateId: "idle",
            event: { name: "onInputFocus", data: undefined },
            toStateId: "fetchAttributeSuggestions",
            isValid: false,
          };

          const expectedContext = {
            get: expect.any(Function),
            set: expect.any(Function),
          };

          expect(onTransition).toHaveBeenCalledWith(
            expectedTransition,
            expectedContext
          );
          expect(machine.getCurrentStateId()).toBe("idle");
        });
      });

      describe("if the associated state exists", () => {
        describe("and it is defined as a string", () => {
          it("should transition the machine to it", () => {
            const { machine } = buildMachine({
              initialStateId: "idle",
              states: {
                idle: {
                  events: {
                    onInputFocus: "fetchAttributeSuggestions",
                  },
                },
                fetchAttributeSuggestions: {},
              },
            });

            machine.sendEvent("onInputFocus");

            expect(machine.getCurrentStateId()).toBe(
              "fetchAttributeSuggestions"
            );
          });
        });

        describe("and it is defined as an object with a targetId", () => {
          it("should transition the machine to it", () => {
            const { machine } = buildMachine({
              initialStateId: "idle",
              states: {
                idle: {
                  events: {
                    onInputFocus: { targetId: "fetchAttributeSuggestions" },
                  },
                },
                fetchAttributeSuggestions: {},
              },
            });

            machine.sendEvent("onInputFocus");

            expect(machine.getCurrentStateId()).toBe(
              "fetchAttributeSuggestions"
            );
          });
        });

        describe("and it is defined as an array of conditionals", () => {
          it("should transition the machine to the first state that matches the condition", () => {
            const cond1 = jest.fn(() => false);
            const cond2 = jest.fn(() => true);

            const toolkit = { suggestionService: { fetch() {} } };

            const { machine } = buildMachine({
              initialStateId: "idle",
              toolkit,
              states: {
                idle: {
                  events: {
                    onInputFocus: [
                      { cond: cond1, targetId: "fetchAttributeSuggestions" },
                      { cond: cond2, targetId: "fetchOperatorSuggestions" },
                    ],
                  },
                },
                fetchAttributeSuggestions: {},
                fetchOperatorSuggestions: {},
              },
            });

            const event = {
              name: "onInputFocus",
              data: { cond: "cond2" },
            };

            machine.sendEvent(event.name, event.data);

            expect(cond1).toHaveBeenCalledWith(
              event,
              machine.getContext(),
              toolkit
            );
            expect(cond2).toHaveBeenCalledWith(
              event,
              machine.getContext(),
              toolkit
            );

            expect(machine.getCurrentStateId()).toBe(
              "fetchOperatorSuggestions"
            );
          });
        });

        it("should notify the onTransition listener of the transition", () => {
          const onTransition = jest.fn();

          const initialContext = { isLoading: false };

          const { machine } = buildMachine({
            initialStateId: "idle",
            context: initialContext,
            onTransition,
            states: {
              idle: {
                events: {
                  onInputFocus: "fetchAttributeSuggestions",
                },
              },
              fetchAttributeSuggestions: {
                events: {
                  onSuggestionsLoaded: "displayAttributeSuggestions",
                },
              },
              displayAttributeSuggestions: {},
            },
          });

          const focusEvent = { name: "onInputFocus" };

          machine.sendEvent(focusEvent.name);

          const loadEvent = {
            name: "onSuggestionsLoaded",
            data: { list: ["seasons", "episodes"] },
          };

          machine.sendEvent(loadEvent.name, loadEvent.data);

          expect(onTransition).toHaveBeenCalledTimes(3);

          const expectedContext = {
            get: expect.any(Function),
            set: expect.any(Function),
          };

          expect(onTransition).toHaveBeenCalledWith(
            {
              fromStateId: null,
              event: StateMachine.initEvent,
              toStateId: "idle",
              isValid: true,
            },
            expectedContext
          );
          expect(onTransition).toHaveBeenCalledWith(
            {
              fromStateId: "idle",
              event: focusEvent,
              toStateId: "fetchAttributeSuggestions",
              isValid: true,
            },
            expectedContext
          );
          expect(onTransition).toHaveBeenCalledWith(
            {
              fromStateId: "fetchAttributeSuggestions",
              event: loadEvent,
              toStateId: "displayAttributeSuggestions",
              isValid: true,
            },
            expectedContext
          );
        });

        describe("when transitioning to a new state", () => {
          describe("state actions (callbacks)", () => {
            describe("onExit(event, ctx, exitToolkit)", () => {
              it("should be properly executed", () => {
                const onExit = jest.fn();

                const initialContext = {
                  isLoading: false,
                };

                const toolkit = { suggestionService: { fetch() {} } };

                const { machine } = buildMachine({
                  initialStateId: "idle",
                  context: initialContext,
                  toolkit,
                  states: {
                    idle: {
                      actions: {
                        onExit,
                      },
                      events: {
                        onInputFocus: "fetchAttributeSuggestions",
                      },
                    },
                    fetchAttributeSuggestions: {},
                  },
                });

                const focusEvent = {
                  name: "onInputFocus",
                  data: { source: "mouse" },
                };

                machine.sendEvent(focusEvent.name, focusEvent.data);

                const expectedToolkit = toolkit;

                expect(onExit).toHaveBeenCalledWith(
                  focusEvent,
                  machine.getContext(),
                  expectedToolkit
                );
              });

              describe('the context instance passed to "onExit"', () => {
                it("should allow the machine context to be updated and the onUpdateContext listener to be notified", () => {
                  const onUpdateContext = jest.fn();

                  const { machine } = buildMachine({
                    initialStateId: "idle",
                    context: {
                      debug: true,
                      isAboutToFetch: false,
                    },
                    onUpdateContext,
                    states: {
                      idle: {
                        actions: {
                          onExit: (event, ctx) =>
                            ctx.set({
                              ...ctx.get(),
                              isAboutToFetch: true,
                            }),
                        },
                        events: {
                          onInputFocus: "fetchAttributeSuggestions",
                        },
                      },
                      fetchAttributeSuggestions: {},
                    },
                  });

                  machine.sendEvent("onInputFocus");

                  const expectedContext = {
                    debug: true,
                    isAboutToFetch: true,
                  };

                  expect(machine.getContext().get()).toEqual(expectedContext);
                  expect(onUpdateContext).toHaveBeenCalledWith(expectedContext);
                });
              });
            });

            describe("onEntry(event, ctx, entryToolkit)", () => {
              it("should be properly executed", () => {
                const onEntryIdle = jest.fn();
                const onEntryFetch = jest.fn();

                const initialContext = {
                  isLoading: false,
                };

                const toolkit = { suggestionService: { fetch() {} } };

                const { machine } = buildMachine({
                  initialStateId: "idle",
                  context: initialContext,
                  toolkit,
                  states: {
                    idle: {
                      actions: {
                        onEntry: onEntryIdle,
                      },
                      events: {
                        onInputFocus: "fetchAttributeSuggestions",
                      },
                    },
                    fetchAttributeSuggestions: {
                      actions: {
                        onEntry: onEntryFetch,
                      },
                    },
                  },
                });

                const focusEvent = {
                  name: "onInputFocus",
                  data: { source: "mouse" },
                };

                machine.sendEvent(focusEvent.name, focusEvent.data);

                const expectedToolkit = {
                  ...toolkit,
                  sendEvent: expect.any(Function),
                };

                expect(onEntryIdle).toHaveBeenCalledWith(
                  StateMachine.initEvent,
                  machine.getContext(),
                  expectedToolkit
                );

                expect(onEntryFetch).toHaveBeenCalledWith(
                  focusEvent,
                  machine.getContext(),
                  expectedToolkit
                );
              });

              describe('the context instance passed to "onEntry"', () => {
                it("should allow the machine context to be updated and the onUpdateContext listener to be notified", () => {
                  const onUpdateContext = jest.fn();

                  const newContext = {
                    isLoading: true,
                    list: [],
                  };

                  const { machine } = buildMachine({
                    initialStateId: "idle",
                    context: {
                      isLoading: false,
                      list: ["seasons", "episodes"],
                    },
                    onUpdateContext,
                    states: {
                      idle: {
                        events: {
                          onInputFocus: "fetchAttributeSuggestions",
                        },
                      },
                      fetchAttributeSuggestions: {
                        actions: {
                          onEntry: (event, ctx) => ctx.set(newContext),
                        },
                      },
                    },
                  });

                  machine.sendEvent("onInputFocus");

                  expect(machine.getContext().get()).toEqual(newContext);
                  expect(onUpdateContext).toHaveBeenCalledWith(newContext);
                });
              });

              describe('the toolkit methods passed to "onEntry"', () => {
                describe("toolkit.sendEvent(eventName, event)", () => {
                  const originalSendEvent = StateMachine.prototype.sendEvent;

                  afterEach(
                    () => (StateMachine.prototype.sendEvent = originalSendEvent)
                  );

                  it('should call the machine\'s "sendEvent" method', () => {
                    jest.spyOn(StateMachine.prototype, "sendEvent");

                    const loadedEvent = {
                      name: "onSuggestionsLoaded",
                      data: { list: ["seasons", "episodes"] },
                    };

                    const { machine } = buildMachine({
                      initialStateId: "idle",
                      states: {
                        idle: {
                          events: {
                            onInputFocus: "fetchAttributeSuggestions",
                          },
                        },
                        fetchAttributeSuggestions: {
                          actions: {
                            onEntry: (event, ctx, toolkit) =>
                              toolkit.sendEvent(
                                loadedEvent.name,
                                loadedEvent.data
                              ),
                          },
                          events: {
                            onSuggestionsLoaded: "displayAttributeSuggestions",
                          },
                        },
                        displayAttributeSuggestions: {},
                      },
                    });

                    machine.sendEvent("onInputFocus");

                    expect(machine.sendEvent).toHaveBeenCalledTimes(2);

                    expect(machine.sendEvent).toHaveBeenCalledWith(
                      "onInputFocus"
                    );

                    expect(machine.sendEvent).toHaveBeenCalledWith(
                      loadedEvent.name,
                      loadedEvent.data
                    );
                  });
                });
              });
            });
          });

          describe("transition actions (callbacks)", () => {
            describe("action(event, ctx, transitionToolkit)", () => {
              it("should be properly executed", () => {
                const setAttribute = jest.fn((event, ctx) => {
                  const newContext = ctx.get();

                  newContext.partialFilter.attribute = event.data.value;

                  ctx.set(newContext);
                });

                const setOperator = jest.fn((event, ctx) => {
                  const newContext = ctx.get();

                  newContext.partialFilter.operator = event.data.value;

                  ctx.set(newContext);
                });

                const toolkit = { suggestionService: { fetch() {} } };

                const { machine } = buildMachine({
                  initialStateId: "idle",
                  context: {
                    partialFilter: {
                      attribute: null,
                      operator: null,
                    },
                  },
                  toolkit,
                  states: {
                    idle: {
                      events: {
                        onInputFocus: [
                          {
                            cond: (event, ctx) =>
                              ctx.get().partialFilter.attribute === null,
                            targetId: "displayAttributesList",
                          },
                          {
                            cond: (event, ctx) =>
                              ctx.get().partialFilter.operator === null,
                            targetId: "displayOperatorsList",
                          },
                        ],
                      },
                    },
                    displayAttributesList: {
                      events: {
                        onAttributeSelected: {
                          targetId: "idle",
                          action: setAttribute,
                        },
                      },
                    },
                    displayOperatorsList: {
                      events: {
                        onOperatorSelected: {
                          targetId: "idle",
                          action: setOperator,
                        },
                      },
                    },
                  },
                });

                machine.sendEvent("onInputFocus");

                const attributeEvent = {
                  name: "onAttributeSelected",
                  data: { value: "seasons" },
                };

                machine.sendEvent(attributeEvent.name, attributeEvent.data);

                machine.sendEvent("onInputFocus");

                const operatorEvent = {
                  name: "onOperatorSelected",
                  data: { value: "=" },
                };

                machine.sendEvent(operatorEvent.name, operatorEvent.data);

                expect(setAttribute).toHaveBeenCalledWith(
                  attributeEvent,
                  machine.getContext(),
                  toolkit
                );

                expect(setOperator).toHaveBeenCalledWith(
                  operatorEvent,
                  machine.getContext(),
                  toolkit
                );
              });
            });
          });
        });
      });
    });
  });
});
