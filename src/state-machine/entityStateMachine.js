import { StateMachine } from "./StateMachine";
import { service } from '../services';

export const entityStateMachine = new StateMachine({
  initialStateId: "idle",
  context: {
    partialFilter: {
      attribute: null,
      operator: null,
    },
    filterId: 1,
    filters: [],
    suggestions: [],
    loading: false,
  },
  onTransition: console.log,
  states: {
    idle: {
      actions: {
        onEntry: (event, ctx) => {
          ctx.set({ ...ctx.get(), loading: false });
        },
      },
      events: {
        onDiscardSuggestions: "idle",
        onInputFocus: [
          {
            cond: (event, ctx) => ctx.get().partialFilter.attribute === null,
            targetId: "loadAttributeSuggestions",
          },
          {
            cond: (event, ctx) => ctx.get().partialFilter.operator === null,
            targetId: "loadOperatorSuggestions",
          },
          {
            cond: (event, ctx) => ctx.get().partialFilter.attribute
              && ctx.get().partialFilter.operator,
            targetId: "loadValueSuggestions",
          },
        ],
        onRemoveFilter: {
          targetId: "idle",
          action: (event, ctx) => {
            const newCtx = ctx.get();
            const { id } = event.data;

            newCtx.filters = newCtx.filters.filter((f) => f.id !== id);

            ctx.set(newCtx);
          },
        },
      },
    },
    // attributes
    loadAttributeSuggestions: {
      actions: {
        onEntry: async (event, ctx, toolkit) => {
          ctx.set({ ...ctx.get(), loading: true });

          const suggestions = await service.loadAttributes();

          ctx.set({ ...ctx.get(), loading: false, suggestions });

          toolkit.sendEvent("onAttributeSuggestionsLoaded");
        },
      },
      events: {
        onDiscardSuggestions: "idle",
        onAttributeSuggestionsLoaded: "displayAttributeSuggestions",
      },
    },
    displayAttributeSuggestions: {
      events: {
        onDiscardSuggestions: "idle",
        onSelectItem: {
          targetId: "idle",
          action: (event, ctx) => {
            const newCtx = ctx.get();

            newCtx.partialFilter.attribute = event.data;

            ctx.set(newCtx);
          },
        },
      },
    },
    // operators
    loadOperatorSuggestions: {
      actions: {
        onEntry: async (event, ctx, toolkit) => {
          ctx.set({ ...ctx.get(), loading: true });

          const suggestions = await service.loadOperators();

          ctx.set({ ...ctx.get(), loading: false, suggestions });

          toolkit.sendEvent("onOperatorSuggestionsLoaded");
        },
      },
      events: {
        onDiscardSuggestions: "idle",
        onOperatorSuggestionsLoaded: "displayOperatorSuggestions",
      },
    },
    displayOperatorSuggestions: {
      events: {
        onDiscardSuggestions: "idle",
        onSelectItem: {
          targetId: "idle",
          action: (event, ctx) => {
            const newCtx = ctx.get();

            newCtx.partialFilter.operator = event.data;

            ctx.set(newCtx);
          },
        },
      },
    },
    // values
    loadValueSuggestions: {
      actions: {
        onEntry: async (event, ctx, toolkit) => {
          ctx.set({ ...ctx.get(), loading: true });

          const suggestions = await service.loadValues();

          ctx.set({ ...ctx.get(), loading: false, suggestions });

          toolkit.sendEvent("onValueSuggestionsLoaded");
        },
      },
      events: {
        onDiscardSuggestions: "idle",
        onValueSuggestionsLoaded: "displayValueSuggestions",
      },
    },
    displayValueSuggestions: {
      events: {
        onDiscardSuggestions: "idle",
        onSelectItem: {
          targetId: "idle",
          action: (event, ctx) => {
            const newCtx = ctx.get();
            const { partialFilter, filters } = newCtx;

            const newFilter = {
              id: newCtx.filterId++,
              attribute: partialFilter.attribute,
              operator: partialFilter.operator,
              operand: event.data,
            }

            filters.push(newFilter);

            partialFilter.attribute = null;
            partialFilter.operator = null;

            ctx.set(newCtx);
          },
        },
      },
    },
  },
});
