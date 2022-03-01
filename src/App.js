import "./App.css";

import { useMemo, useState } from "react";
import { Form, Header } from "semantic-ui-react";

import { FilterBar } from "./components/FilterBar";
import { buildAppStateMachine } from "./state";
import { useFiltersFromUrl } from "./hooks/useFiltersFromUrl";
import { AppMessage } from "./AppMessage";

export const App = () => {
  const [initFilters] = useFiltersFromUrl();
  const [filters, setFilters] = useState(initFilters);
  const [stateId, setStateId] = useState(null);

  const appStateMachine = useMemo(() => buildAppStateMachine({
    initFilters,
    onTransition: (transition) => {
      setStateId(transition.toStateId);
    },
    onUpdateFilters: (newFilters, event) => {
      const { action, filter, prevFilter, part } = event;

      if (action === 'edit') {
        console.log('🧪 %s "%s" filter\'s %s', action, prevFilter.type, part);
        console.log('  🔎 %o → %o', prevFilter[part], filter[part]);
      } else {
        console.log('🧪 %s "%s" filter', action, filter.type);
        console.log('  🔎', filter);
      }

      setFilters(newFilters);
    },
  }), [initFilters]);

  return (
    <div className="container">
      <Header as='h1'>🧪 Rick &amp; Morty filter bar 🧪</Header>

      <Form style={{ marginTop: '42px' }}>
        <FilterBar stateMachine={appStateMachine} />
      </Form>

      <AppMessage stateId={stateId} filters={filters} />
    </div>
  );
};

export default App;
